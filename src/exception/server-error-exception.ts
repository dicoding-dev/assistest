import SubmissionErrorException from "./submission-error-excepion";

class ServerErrorException extends SubmissionErrorException {
    constructor(code: string, message?: string, serverErrorLog?: string[]) {
        super();
        this.code = code;
        this.message = message;
        this.serverErrorLog = serverErrorLog;
        this.failurePostmanTest = []
    }
}

export default ServerErrorException