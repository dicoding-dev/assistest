import ResultTestFailure from "../service/postman-runner/failure-test";
import SubmissionErrorException from "./submission-error-excepion";

class PostmanTestFailedException extends SubmissionErrorException{
    constructor(code: string, failurePostmanTest: ResultTestFailure[], message?: string, serverErrorLog?: string[]) {
        super();
        this.code = code;
        this.message = message;
        this.serverErrorLog = serverErrorLog;
        this.failurePostmanTest = failurePostmanTest
    }
}

export default PostmanTestFailedException