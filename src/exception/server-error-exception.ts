import SubmissionErrorException from "./submission-error-exception";

class ServerErrorException extends SubmissionErrorException {
    constructor(message: string, additionalMessage?: string, serverErrorLog?: string[]) {
        super(message);
        this.message = message;
        this.additionalMessage = additionalMessage;
        this.serverErrorLog = serverErrorLog;
        this.failurePostmanTest = []
    }
}

export default ServerErrorException
