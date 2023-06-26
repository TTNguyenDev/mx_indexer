import { readFileSync } from "fs";
import * as yaml from "js-yaml";
import { join } from "path";
const YAML_CONFIG_FILENAME = "config.yaml";
export function readConfig() {
    let fileStr = readFileSync(join(__dirname, YAML_CONFIG_FILENAME), "utf8");
    const env = process.env;
    Object.entries(env).map(([k, v]) => {
        fileStr = fileStr.replace(new RegExp(`\\$\\{${k}\\}`, "gm"), v || "");
    });
    return yaml.load(fileStr);
}
//# sourceMappingURL=configuration.js.map