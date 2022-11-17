import * as fs from "fs";
import PackageJson from "./package-json";
import ProjectErrorException from "../../exception/project-error-exception";
import SubmissionProject from "./submission-project";
import {runnerCommand} from "../../conifg/backend-pemula-project-requirement";


export default class SubmissionProjectFactory {
    private packageJsonContent: PackageJson

    public create(projectPath?: string): SubmissionProject {
        this.validate(projectPath)
        return {
            packageJsonContent: this.packageJsonContent,
            packageJsonPath: projectPath
        }
    }

    private validate(projectPath: string) {
        if (projectPath === null) {
            throw new ProjectErrorException('PATH_NOT_CONTAIN_PACKAGE_JSON')
        }

        this.validatePackageJSONContent(projectPath)

        const {scripts} = this.packageJsonContent
        if (!scripts) {
            throw new ProjectErrorException('PACKAGE_JSON_NOT_CONTAIN_SCRIPT_PROPERTY')
        }

        if (!Object.keys(scripts).includes(runnerCommand)) {
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