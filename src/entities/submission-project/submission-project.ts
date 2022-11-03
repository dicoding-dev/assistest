import * as fs from "fs";
import * as path from 'path';
import ProjectPath from "../project-path/project-path";
import InvariantException from "../../exception/invariant-exception";

export default class SubmissionProject {
    private readonly _projectPath: string;
    private readonly _host: string;
    private readonly _port: number;
    private readonly _runnerCommand: string;
    private _packageJSONContent: any

    constructor(projectPath: ProjectPath, host: string, port: number, packageJSONScript: string) {
        this.validate(projectPath, host, port, packageJSONScript)

        this._projectPath = projectPath.toString();
        this._host = host;
        this._port = port;
        this._runnerCommand = packageJSONScript;
    }

    private validate(projectPath: ProjectPath, host: string, port: number, runnerCommand: string) {
        const packageJSONPath = path.resolve(projectPath.toString(), 'package.json')
        if (!fs.existsSync(packageJSONPath)) {
            throw new InvariantException('Path not contain package.json')
        }

        this.validatePackageJSONContent(packageJSONPath)

        const {scripts} = this._packageJSONContent
        if (!scripts) {
            throw new InvariantException('package.json not contain "scripts" property')
        }

        if (!Object.keys(scripts).includes(runnerCommand)) {
            throw new InvariantException('Runner script not found')
        }
    }

    private validatePackageJSONContent(packageJSONPath: string) {
        try {
            const content = JSON.parse(fs.readFileSync(packageJSONPath, 'utf8'))
            this._packageJSONContent = content
            return content
        } catch (e) {
            if (e.message.includes("Unexpected token")) {
                throw new InvariantException('Cannot parse package.json')
            }
        }
    }

    get packageJSONContent(): any {
        return this._packageJSONContent;
    }

    get runnerCommand(): string {
        return this._runnerCommand;
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