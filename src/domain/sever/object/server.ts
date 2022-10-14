import * as fs from "fs";
import * as path from 'path';
import InvariantException from "../../../exception/invariant-exception";

export default class Server {
    private projectPath: string;
    private host: string;
    private port: number;
    private packageJSONScript: string;

    constructor(projectPath: string, host: string, port: number, packageJSONScript: string) {
        this.validate(projectPath, host, port, packageJSONScript)

        this.projectPath = projectPath;
        this.host = host;
        this.port = port;
        this.packageJSONScript = packageJSONScript;
    }

    private validate = (projectPath: string, host: string, port: number, packageJSONScript: string) => {
        const packageJSONPath = path.resolve(projectPath, 'package.json')
        if (!fs.existsSync(packageJSONPath)) {
            throw new InvariantException('Path not contain package.json')
        }

        const {scripts} = JSON.parse(fs.readFileSync(packageJSONPath, 'utf8'))

        if (!Object.keys(scripts).includes(packageJSONScript)) {
            throw new InvariantException('Runner script not found')
        }
    }
}