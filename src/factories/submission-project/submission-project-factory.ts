import * as fs from "fs";
import ProjectErrorException from "../../exception/project-error-exception";
import {runnerCommand} from "../../conifg/backend-pemula-project-requirement";
import * as path from "path";
import PackageJson from "../../entities/submission-project/package-json";
import SubmissionProject from "../../entities/submission-project/submission-project";


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

        this.validatePackageJSONContent(path.resolve(projectPath, 'package.json'))

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