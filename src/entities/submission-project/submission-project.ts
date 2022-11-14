import * as fs from "fs";
import * as path from 'path';
import ProjectPath from "../project-path/project-path";
import InvariantException from "../../exception/invariant-exception";
import PackageJson from "./package-json";

export default class SubmissionProject {
    private readonly _projectPath: string;
    private readonly _host: string;
    private readonly _port: number;
    private readonly _runnerCommand: string;
    private _packageJSONContent: PackageJson

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
            throw new InvariantException('PATH_NOT_CONTAIN_PACKAGE_JSON')
        }

        this.validatePackageJSONContent(packageJSONPath)

        const {scripts} = this._packageJSONContent
        if (!scripts) {
            throw new InvariantException('PACKAGE_JSON_NOT_CONTAIN_SCRIPT_PROPERTY')
        }

        if (!Object.keys(scripts).includes(runnerCommand)) {
            throw new InvariantException('RUNNER_SCRIPT_NOT_FOUND')
        }
    }

    private validatePackageJSONContent(packageJSONPath: string) {
        try {
            const content = JSON.parse(fs.readFileSync(packageJSONPath, 'utf8'))
            this._packageJSONContent = content
            return content
        } catch (e) {
            if (e.message.includes("Unexpected token")) {
                throw new InvariantException('CANNOT_PARSE_PACKAGE_JSON')
            }
        }
    }

    get packageJSONContent(): PackageJson {
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