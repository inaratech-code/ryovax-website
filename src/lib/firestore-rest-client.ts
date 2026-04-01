import { importPKCS8, SignJWT } from "jose";

type ServiceAccountJson = {
    project_id: string;
    client_email: string;
    private_key: string;
};

type FirestoreJsonValue = Record<string, unknown>;

let tokenCache: { token: string; expiresAt: number } | null = null;

function getServiceAccount(): ServiceAccountJson {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
    if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not set");
    return JSON.parse(raw) as ServiceAccountJson;
}

async function getAccessToken(): Promise<string> {
    const now = Date.now();
    if (tokenCache && tokenCache.expiresAt > now + 60_000) {
        return tokenCache.token;
    }
    const sa = getServiceAccount();
    const key = await importPKCS8(sa.private_key.replace(/\\n/g, "\n"), "RS256");
    const iat = Math.floor(now / 1000);
    const jwt = await new SignJWT({
        scope: "https://www.googleapis.com/auth/datastore",
    })
        .setProtectedHeader({ alg: "RS256", typ: "JWT" })
        .setIssuer(sa.client_email)
        .setSubject(sa.client_email)
        .setAudience("https://oauth2.googleapis.com/token")
        .setIssuedAt(iat)
        .setExpirationTime(iat + 3600)
        .sign(key);

    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: jwt,
        }),
    });
    if (!res.ok) {
        throw new Error(`OAuth token request failed: ${res.status} ${await res.text()}`);
    }
    const body = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!body.access_token) throw new Error("OAuth response missing access_token");
    const ttlMs = (body.expires_in ?? 3600) * 1000;
    tokenCache = { token: body.access_token, expiresAt: now + ttlMs };
    return body.access_token;
}

function baseUrl(projectId: string): string {
    return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
}

function documentName(projectId: string, collectionId: string, docId: string): string {
    return `projects/${projectId}/databases/(default)/documents/${collectionId}/${docId}`;
}

function docIdFromName(name: string): string {
    const parts = name.split("/");
    return parts[parts.length - 1] ?? "";
}

function encodePrimitive(v: unknown): FirestoreJsonValue {
    if (v === null || v === undefined) {
        return { nullValue: null };
    }
    if (typeof v === "string") {
        return { stringValue: v };
    }
    if (typeof v === "boolean") {
        return { booleanValue: v };
    }
    if (typeof v === "number") {
        if (Number.isInteger(v) && Math.abs(v) <= Number.MAX_SAFE_INTEGER) {
            return { integerValue: String(v) };
        }
        return { doubleValue: v };
    }
    if (v instanceof Date) {
        return { timestampValue: v.toISOString() };
    }
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
        const fields: Record<string, FirestoreJsonValue> = {};
        for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
            if (val === undefined) continue;
            fields[k] = encodeValue(val);
        }
        return { mapValue: { fields } };
    }
    if (Array.isArray(v)) {
        return {
            arrayValue: {
                values: v.map((x) => encodeValue(x)),
            },
        };
    }
    return { stringValue: String(v) };
}

function encodeValue(v: unknown): FirestoreJsonValue {
    return encodePrimitive(v);
}

function encodeFields(data: Record<string, unknown>): Record<string, FirestoreJsonValue> {
    const out: Record<string, FirestoreJsonValue> = {};
    for (const [k, v] of Object.entries(data)) {
        if (v === undefined) continue;
        out[k] = encodeValue(v);
    }
    return out;
}

function decodeValue(v: FirestoreJsonValue): unknown {
    if ("nullValue" in v) return null;
    if ("stringValue" in v) return v.stringValue;
    if ("booleanValue" in v) return v.booleanValue;
    if ("integerValue" in v) return Number(v.integerValue);
    if ("doubleValue" in v) return v.doubleValue;
    if ("timestampValue" in v) return String(v.timestampValue);
    if ("mapValue" in v && v.mapValue && typeof v.mapValue === "object" && "fields" in v.mapValue) {
        const fields = (v.mapValue as { fields?: Record<string, FirestoreJsonValue> }).fields;
        if (!fields) return {};
        const out: Record<string, unknown> = {};
        for (const [k, val] of Object.entries(fields)) {
            out[k] = decodeValue(val);
        }
        return out;
    }
    if ("arrayValue" in v && v.arrayValue && typeof v.arrayValue === "object" && "values" in v.arrayValue) {
        const arr = (v.arrayValue as { values?: FirestoreJsonValue[] }).values;
        return (arr ?? []).map((x) => decodeValue(x));
    }
    return v;
}

function decodeFields(fields: Record<string, FirestoreJsonValue> | undefined): Record<string, unknown> {
    if (!fields) return {};
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(fields)) {
        out[k] = decodeValue(v);
    }
    return out;
}

export class RestDocumentReference {
    constructor(
        readonly db: RestFirestore,
        readonly collectionId: string,
        readonly id: string,
    ) {}

    get path(): string {
        return `${this.collectionId}/${this.id}`;
    }

    get name(): string {
        return documentName(this.db.projectId, this.collectionId, this.id);
    }

    async get(): Promise<RestDocumentSnapshot> {
        const token = await getAccessToken();
        const url = `${baseUrl(this.db.projectId)}/${encodeURIComponent(this.collectionId)}/${encodeURIComponent(this.id)}`;
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 404) {
            return new RestDocumentSnapshot(this, false, {});
        }
        if (!res.ok) {
            throw new Error(`Firestore get failed: ${res.status} ${await res.text()}`);
        }
        const json = (await res.json()) as { name?: string; fields?: Record<string, FirestoreJsonValue> };
        return new RestDocumentSnapshot(this, true, decodeFields(json.fields));
    }

    async set(data: Record<string, unknown>, options?: { merge?: boolean }): Promise<void> {
        const token = await getAccessToken();
        const fields = encodeFields(data);
        const patchUrl = `${baseUrl(this.db.projectId)}/${encodeURIComponent(this.collectionId)}/${encodeURIComponent(this.id)}`;
        const createUrl = `${baseUrl(this.db.projectId)}/${encodeURIComponent(this.collectionId)}?documentId=${encodeURIComponent(this.id)}`;
        const keys = Object.keys(fields);
        const mask =
            keys.length > 0
                ? keys.map((f) => `updateMask.fieldPaths=${encodeURIComponent(f)}`).join("&")
                : "";

        if (options?.merge) {
            const res = await fetch(mask ? `${patchUrl}?${mask}` : patchUrl, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fields }),
            });
            if (!res.ok) throw new Error(`Firestore set(merge) failed: ${res.status} ${await res.text()}`);
            return;
        }

        const tryPatch = await fetch(mask ? `${patchUrl}?${mask}` : patchUrl, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fields }),
        });
        if (tryPatch.ok) return;
        if (tryPatch.status === 404) {
            const createRes = await fetch(createUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fields }),
            });
            if (!createRes.ok) {
                throw new Error(`Firestore create failed: ${createRes.status} ${await createRes.text()}`);
            }
            return;
        }
        throw new Error(`Firestore set failed: ${tryPatch.status} ${await tryPatch.text()}`);
    }

    async update(data: Record<string, unknown>): Promise<void> {
        const token = await getAccessToken();
        const fields = encodeFields(data);
        const url = `${baseUrl(this.db.projectId)}/${encodeURIComponent(this.collectionId)}/${encodeURIComponent(this.id)}`;
        const mask = Object.keys(fields)
            .map((f) => `updateMask.fieldPaths=${encodeURIComponent(f)}`)
            .join("&");
        const res = await fetch(`${url}?${mask}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fields }),
        });
        if (!res.ok) throw new Error(`Firestore update failed: ${res.status} ${await res.text()}`);
    }

    async delete(): Promise<void> {
        const token = await getAccessToken();
        const url = `${baseUrl(this.db.projectId)}/${encodeURIComponent(this.collectionId)}/${encodeURIComponent(this.id)}`;
        const res = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 404) return;
        if (!res.ok) throw new Error(`Firestore delete failed: ${res.status} ${await res.text()}`);
    }
}

export class RestDocumentSnapshot {
    constructor(
        readonly ref: RestDocumentReference,
        readonly exists: boolean,
        private readonly _data: Record<string, unknown>,
    ) {}

    data(): Record<string, unknown> {
        return this._data;
    }
}

export class RestQueryDocumentSnapshot {
    constructor(
        readonly ref: RestDocumentReference,
        private readonly _data: Record<string, unknown>,
    ) {}

    get id(): string {
        return this.ref.id;
    }

    data(): Record<string, unknown> {
        return this._data;
    }
}

export class RestQuerySnapshot {
    readonly docs: RestQueryDocumentSnapshot[];

    constructor(docs: RestQueryDocumentSnapshot[]) {
        this.docs = docs;
    }

    get empty(): boolean {
        return this.docs.length === 0;
    }

    forEach(fn: (doc: RestQueryDocumentSnapshot) => void): void {
        this.docs.forEach(fn);
    }
}

export class RestAggregateQuerySnapshot {
    constructor(private readonly count: number) {}

    data(): { count: number } {
        return { count: this.count };
    }
}

type RestFieldFilter = { fieldPath: string; op: string; value: FirestoreJsonValue };

function buildWhereClause(filters: RestFieldFilter[] | undefined): Record<string, unknown> | undefined {
    if (!filters || filters.length === 0) return undefined;
    if (filters.length === 1) {
        const f = filters[0]!;
        return {
            fieldFilter: {
                field: { fieldPath: f.fieldPath },
                op: f.op,
                value: f.value,
            },
        };
    }
    return {
        compositeFilter: {
            op: "AND",
            filters: filters.map((f) => ({
                fieldFilter: {
                    field: { fieldPath: f.fieldPath },
                    op: f.op,
                    value: f.value,
                },
            })),
        },
    };
}

export class RestQuery {
    constructor(
        private readonly db: RestFirestore,
        private readonly collectionId: string,
        private readonly filters: RestFieldFilter[] = [],
        private readonly lim = 0,
    ) {}

    where(fieldPath: string, op: string, value: unknown): RestQuery {
        return new RestQuery(this.db, this.collectionId, [
            ...this.filters,
            { fieldPath, op: opToRest(op), value: encodeValue(value) },
        ], this.lim);
    }

    limit(n: number): RestQuery {
        return new RestQuery(this.db, this.collectionId, this.filters, n);
    }

    count(): RestAggregateQuery {
        return new RestAggregateQuery(this.db, this.collectionId, this.filters);
    }

    async get(): Promise<RestQuerySnapshot> {
        const rows = await runStructuredQuery(
            this.db.projectId,
            this.collectionId,
            this.filters,
            this.lim > 0 ? this.lim : undefined,
        );
        const docs = rows.map((row) => {
            const name = row.document.name as string;
            const id = docIdFromName(name);
            const ref = new RestDocumentReference(this.db, this.collectionId, id);
            const fields = (row.document as { fields?: Record<string, FirestoreJsonValue> }).fields;
            return new RestQueryDocumentSnapshot(ref, decodeFields(fields));
        });
        return new RestQuerySnapshot(docs);
    }
}

function opToRest(op: string): string {
    if (op === "==") return "EQUAL";
    return op;
}

export class RestAggregateQuery {
    constructor(
        private readonly db: RestFirestore,
        private readonly collectionId: string,
        private readonly filters: RestFieldFilter[] = [],
    ) {}

    async get(): Promise<RestAggregateQuerySnapshot> {
        const n = await runAggregationCount(this.db.projectId, this.collectionId, this.filters);
        return new RestAggregateQuerySnapshot(n);
    }
}

async function runStructuredQuery(
    projectId: string,
    collectionId: string,
    filters: RestFieldFilter[] | undefined,
    limit?: number,
): Promise<Array<{ document: { name: string; fields?: Record<string, FirestoreJsonValue> } }>> {
    const token = await getAccessToken();
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
    const structuredQuery: Record<string, unknown> = {
        from: [{ collectionId }],
    };
    const where = buildWhereClause(filters);
    if (where) {
        structuredQuery.where = where;
    }
    if (limit != null && limit > 0) {
        structuredQuery.limit = limit;
    }
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ structuredQuery }),
    });
    if (!res.ok) {
        throw new Error(`Firestore runQuery failed: ${res.status} ${await res.text()}`);
    }
    const json = (await res.json()) as Array<{
        document?: { name: string; fields?: Record<string, FirestoreJsonValue> };
    }>;
    if (!Array.isArray(json)) return [];
    return json.filter((r) => r.document != null).map((r) => ({ document: r.document! }));
}

async function runAggregationCount(
    projectId: string,
    collectionId: string,
    filters?: RestFieldFilter[],
): Promise<number> {
    const token = await getAccessToken();
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runAggregationQuery`;
    const structuredQuery: Record<string, unknown> = {
        from: [{ collectionId }],
    };
    const whereAgg = buildWhereClause(filters);
    if (whereAgg) {
        structuredQuery.where = whereAgg;
    }
    const body = {
        structuredAggregationQuery: {
            structuredQuery,
            aggregations: [{ alias: "count", count: {} }],
        },
    };
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const fallback = await countViaQuery(projectId, collectionId, filters);
        return fallback;
    }
    const json = (await res.json()) as Array<{
        result?: { aggregateFields?: Record<string, FirestoreJsonValue> };
    }>;
    if (!Array.isArray(json) || json.length === 0) return 0;
    const agg = json[0]?.result?.aggregateFields?.count;
    if (agg && "integerValue" in agg) return Number((agg as { integerValue: string }).integerValue);
    if (agg && "doubleValue" in agg) return Number((agg as { doubleValue: number }).doubleValue);
    return 0;
}

async function countViaQuery(
    projectId: string,
    collectionId: string,
    filters?: RestFieldFilter[],
): Promise<number> {
    const rows = await runStructuredQuery(projectId, collectionId, filters, undefined);
    return rows.length;
}

export class RestCollectionReference {
    constructor(
        readonly db: RestFirestore,
        readonly collectionId: string,
    ) {}

    doc(id: string): RestDocumentReference {
        return new RestDocumentReference(this.db, this.collectionId, id);
    }

    where(fieldPath: string, op: string, value: unknown): RestQuery {
        return new RestQuery(this.db, this.collectionId, [
            { fieldPath, op: opToRest(op), value: encodeValue(value) },
        ]);
    }

    count(): RestAggregateQuery {
        return new RestAggregateQuery(this.db, this.collectionId, []);
    }

    async get(): Promise<RestQuerySnapshot> {
        const token = await getAccessToken();
        const url = `${baseUrl(this.db.projectId)}/${encodeURIComponent(this.collectionId)}`;
        const out: RestQueryDocumentSnapshot[] = [];
        let pageToken: string | undefined;
        do {
            const qs = new URLSearchParams({ pageSize: "300" });
            if (pageToken) qs.set("pageToken", pageToken);
            const res = await fetch(`${url}?${qs.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error(`Firestore list failed: ${res.status} ${await res.text()}`);
            const json = (await res.json()) as {
                documents?: Array<{ name: string; fields?: Record<string, FirestoreJsonValue> }>;
                nextPageToken?: string;
            };
            const docs = json.documents ?? [];
            for (const d of docs) {
                const id = docIdFromName(d.name);
                const ref = new RestDocumentReference(this.db, this.collectionId, id);
                out.push(new RestQueryDocumentSnapshot(ref, decodeFields(d.fields)));
            }
            pageToken = json.nextPageToken;
        } while (pageToken);
        return new RestQuerySnapshot(out);
    }

    async add(data: Record<string, unknown>): Promise<RestDocumentReference> {
        const id =
            typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
                ? crypto.randomUUID().replace(/-/g, "")
                : `doc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const ref = this.doc(id);
        await ref.set(data);
        return ref;
    }
}

export type RestWriteBatchWrite =
    | { delete: string }
    | { update: { name: string; fields: Record<string, FirestoreJsonValue> } };

/** Admin SDK DocumentReference or our REST ref — both expose `.path` (`collection/docId`). */
type BatchDocRef = RestDocumentReference | { path: string };

function documentNameFromRef(db: RestFirestore, ref: BatchDocRef): string {
    if (ref instanceof RestDocumentReference) return ref.name;
    const p = ref.path;
    if (p.startsWith("projects/")) return p;
    return `projects/${db.projectId}/databases/(default)/documents/${p}`;
}

export class RestWriteBatch {
    private readonly writes: RestWriteBatchWrite[] = [];

    constructor(private readonly db: RestFirestore) {}

    delete(ref: BatchDocRef): void {
        this.writes.push({ delete: documentNameFromRef(this.db, ref) });
    }

    set(ref: BatchDocRef, data: Record<string, unknown>): void {
        this.writes.push({
            update: {
                name: documentNameFromRef(this.db, ref),
                fields: encodeFields(data),
            },
        });
    }

    async commit(): Promise<void> {
        if (this.writes.length === 0) return;
        const token = await getAccessToken();
        const url = `https://firestore.googleapis.com/v1/projects/${this.db.projectId}/databases/(default)/documents:batchWrite`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ writes: this.writes }),
        });
        if (!res.ok) throw new Error(`Firestore batchWrite failed: ${res.status} ${await res.text()}`);
    }
}

export class RestFirestore {
    readonly projectId: string;

    constructor(projectId: string) {
        this.projectId = projectId;
    }

    collection(collectionId: string): RestCollectionReference {
        return new RestCollectionReference(this, collectionId);
    }

    batch(): RestWriteBatch {
        return new RestWriteBatch(this);
    }
}

let cachedRest: RestFirestore | undefined;

export function getRestFirestoreDb(): RestFirestore {
    if (cachedRest) return cachedRest;
    const sa = getServiceAccount();
    cachedRest = new RestFirestore(sa.project_id);
    return cachedRest;
}
