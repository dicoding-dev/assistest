import SubmissionErrorException from "./submission-error-excepion";

class ProjectErrorException extends SubmissionErrorException {
    constructor(message: string, additionalMessage?: string, serverErrorLog?: string[]) {
        super(message)
        this.message = message;
        this.additionalMessage = additionalMessage;
        this.serverErrorLog = serverErrorLog;
        this.failurePostmanTest = []
    }
}

export default ProjectErrorException