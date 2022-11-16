import * as fs from "fs";
import * as path from 'path';
import PackageJson from "./package-json";
import ProjectErrorException from "../../exception/project-error-exception";
import backendPemulaProjectRequirement from "../../conifg/backend-pemula-project-requirement";
import SubmissionProject from "./submission-project";


export default class SubmissionProjectFactory {
    private readonly projectPath?: string;
    private packageJsonContent: PackageJson

    constructor(projectPath?: string) {
        this.projectPath = projectPath;
        this.validate()
    }

    public create(): SubmissionProject {
        return {
            packageJsonContent: this.packageJsonContent,
            packageJsonPath: this.projectPath
        }
    }

    private validate() {
        if (!this.projectPath) {
            throw new ProjectErrorException('PATH_NOT_CONTAIN_PACKAGE_JSON')
        }

        const packageJSONPath = path.resolve(this.projectPath, 'package.json')


        this.validatePackageJSONContent(packageJSONPath)

        const {scripts} = this.packageJsonContent
        if (!scripts) {
            throw new ProjectErrorException('PACKAGE_JSON_NOT_CONTAIN_SCRIPT_PROPERTY')
        }

        if (!Object.keys(scripts).includes(backendPemulaProjectRequirement.runnerCommand)) {
            throw new ProjectErrorException('RUNNER_SCRIPT_NOT_FOUND')
        }
    }

    private validatePackageJSONContent(packageJSONPath: string) {
        try {
            const content = JSON.parse(fs.readFileSync(packageJSONPath, 'utf8'))
            this.packageJsonContent = content
            return content
        } catch (e) {
            if (e.message.includes("Unexpected token")) {
                throw new ProjectErrorException('CANNOT_PARSE_PACKAGE_JSON')
            }
        }
    }
}