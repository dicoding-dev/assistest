import * as fs from "fs";
import ProjectErrorException from "../../exception/project-error-exception";
import * as path from "path";
import PackageJson from "../../entities/submission-project/package-json";
import SubmissionProject from "../../entities/submission-project/submission-project";


export default class SubmissionProjectFactory {
    private packageJsonContent: PackageJson

    public create(projectPath?: string): SubmissionProject {
        this.validate(projectPath)

        return {
            packageJsonContent: this.packageJsonContent,
            packageJsonPath: projectPath,
            runnerCommand: this.getRunnerCommand()
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
    }

    private getRunnerCommand() {
        const scripts = this.packageJsonContent.scripts

        if ('start' in scripts) {
            return 'start'
        } else if ('dev' in scripts) {
            return 'dev'
        } else if ('start-dev' in scripts) {
            return 'start-dev'
        } else if ('start:dev' in scripts) {
            return 'start:ev'
        } else {
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