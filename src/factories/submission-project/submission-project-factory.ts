import * as fs from "fs";
import ProjectErrorException from "../../exception/project-error-exception";
import * as path from "path";
import PackageJson from "../../entities/submission-project/package-json";
import SubmissionProject from "../../entities/submission-project/submission-project";
import {SubmissionRequirement} from "../../config/submission-requirement";
import domainEvent from "../../common/domain-event";
import postReviewMethod from "../../entities/review-result/post-review-method";


export default class SubmissionProjectFactory {
    private packageJsonContent: PackageJson

    public create(submissionRequirement: SubmissionRequirement, projectPath?: string): SubmissionProject {
        this.validate(projectPath)
        this.checkExistingNodeModules(projectPath)
        this.checkDependencies()


        const runnerCommand = this.getRunnerCommand()

        this.checkRunnerCommandUseNodeCommand(runnerCommand)

        submissionRequirement.PROJECT_HAVE_CORRECT_RUNNER_SCRIPT.status = true
        domainEvent('project has meet requirement')
        return {
            packageJsonContent: this.packageJsonContent,
            packageJsonPath: projectPath,
            runnerCommand
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
        }

        throw new ProjectErrorException('RUNNER_SCRIPT_NOT_FOUND', null, null, postReviewMethod.Reject)
    }

    private checkDependencies() {
        const dependencies = Object.keys(this.packageJsonContent.dependencies ?? {})

        const possibleDatabaseDependencies = ['mongoose', 'mysql', 'pg', 'mssql', 'mariadb']
        const iProjectContainDatabase = dependencies.some(dependency => possibleDatabaseDependencies.includes(dependency))
        if (iProjectContainDatabase) {
            throw new ProjectErrorException('PROJECT_CONTAIN_DATABASE_DEPENDENCY', null, null, postReviewMethod.Reject)
        }

        const possibleOtherFrameworkDependencies = ['express']
        const isProjectContainOtherFramework = dependencies.some(dependency => possibleOtherFrameworkDependencies.includes(dependency))
        if (isProjectContainOtherFramework) {
            throw new ProjectErrorException('PROJECT_CONTAIN_OTHER_FRAMEWORK_DEPENDENCY', null, null, postReviewMethod.Reject)
        }
    }

    private checkExistingNodeModules(projectPath: string) {
        if (fs.existsSync(path.resolve(projectPath, 'node_modules'))) {
            throw new ProjectErrorException('PROJECT_CONTAIN_NODE_MODULES', null, null, postReviewMethod.Reject)
        }
    }

    private checkRunnerCommandUseNodeCommand(runnerCommand: string) {
        if (this.packageJsonContent.scripts[runnerCommand].includes('nodemon')) {
            throw new ProjectErrorException('RUNNER_COMMAND_CONTAIN_NODEMON', null, null, postReviewMethod.Reject)
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
