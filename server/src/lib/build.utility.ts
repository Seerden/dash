import path from "path";
import { fileURLToPath } from "url";

// Node does not have access to __dirname and __filename in ES modules when
// built, so we need this for the production build.
const __filename = fileURLToPath(import.meta.url);
export const NODE__dirname = path.dirname(__filename);
