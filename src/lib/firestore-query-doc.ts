/**
 * Minimal shape shared by Firebase Admin and REST query document snapshots
 * (forEach / docs[] callbacks) so strict TS does not infer implicit `any`.
 */
export type FirestoreQueryDoc = {
    id: string;
    data: () => Record<string, unknown>;
    ref: { path: string };
};
