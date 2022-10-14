import * as fs from "fs";
import * as path from 'path';
import InvariantException from "../../../exception/invariant-exception";

export default class Server {
    private readonly _projectPath: string;
    private readonly _host: string;
    private readonly _port: number;
    private readonly _packageJSONScript: string;

    constructor(projectPath: string, host: string, port: number, packageJSONScript: string) {
        this.validate(projectPath, host, port, packageJSONScript)

        this._projectPath = projectPath;
        this._host = host;
        this._port = port;
        this._packageJSONScript = packageJSONScript;
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
    get packageJSONScript(): string {
        return this._packageJSONScript;
    }
    get port(): number {
        return this._port;
    }
    get host(): string {
        return this._host;
    }
    get projectPath(): string {
        return this._projectPath;
    }
}