import SubmissionErrorException from "./submission-error-excepion";

class PostmanTestFailedException extends SubmissionErrorException{
    constructor(message: string, additionalMessage?: string, serverErrorLog?: string[]) {
        super(message);
        this.message = message;
        this.additionalMessage = additionalMessage;
        this.serverErrorLog = serverErrorLog;
    }
}

export default PostmanTestFailedException