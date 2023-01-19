import ProjectErrorException from "../../exception/project-error-exception";
import ServerErrorException from "../../exception/server-error-exception";
import SubmissionProject from "../../entities/submission-project/submission-project";
import {port, runnerCommand} from "../../config/backend-pemula-project-requirement";

class ServerErrorHandler {
    private readonly allErrorLog: string;
    private readonly submissionProject: SubmissionProject;
    private readonly logErrors: string[];

    constructor(logErrors: string[], submissionProject: SubmissionProject) {
        this.submissionProject = submissionProject;
        this.logErrors = logErrors
        this.allErrorLog = logErrors.join('\n')
    }

    throwError() {
        this.validatePort()
        this.validateCommand()
        this.validateModule()

        throw new ServerErrorException(`SERVER_ERROR`,
            `command: ${runnerCommand}
            path: ${this.submissionProject.packageJsonPath.toString()}
            hint: Maybe the port server is not 9000`,
            this.logErrors
        )
    }

    private validatePort() {
        const portFromLogError = this.getPortFromLogError()
        if ((portFromLogError && portFromLogError != port) || !this.logErrors.length) {
            throw new ProjectErrorException('PORT_NOT_MEET_REQUIREMENT')
        }
    }

    private validateCommand() {
        const commandFromLogError = this.getCommandFromLogError()
        if (commandFromLogError) {
            throw new ServerErrorException('COMMAND_NOT_FOUND', null, this.logErrors)
        }
    }

    private validateModule() {
        if (this.allErrorLog.includes('Error: Cannot find module')) {
            throw new ServerErrorException('MODULE_NOT_FOUND', null, this.logErrors)
        }
    }

    private getPortFromLogError() {
        const portErrorRegex = new RegExp(/Error: listen EADDRINUSE: address already in use.+?:(\d+)/g)
        const result = portErrorRegex.exec(this.allErrorLog)
        if (result !== null) {
            return parseInt(result[1])
        }
        return null
    }

    private getCommandFromLogError() {
        const portErrorRegex = new RegExp(/sh: 1: (.+): not found/g)
        const result = portErrorRegex.exec(this.allErrorLog)
        if (result !== null) {
            return result[1]
        }
        return null
    }
}

export default ServerErrorHandler