import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const em = "\u2014";

function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(p);
        else if (/\.(tsx|ts|json)$/.test(ent.name)) {
            const c = fs.readFileSync(p, "utf8");
            if (c.includes(em)) {
                fs.writeFileSync(p, c.split(em).join(", "), "utf8");
                console.log(path.relative(root, p));
            }
        }
    }
}

walk(path.join(root, "src"));
walk(path.join(root, "data"));
