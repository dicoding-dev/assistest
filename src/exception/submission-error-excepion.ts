import ResultTestFailure from "../service/postman-runner/failure-test";

abstract class SubmissionErrorException extends Error{
    message: string
    additionalMessage: string
    serverErrorLog: string[]
    failurePostmanTest: ResultTestFailure[]

    protected constructor(message: string) {
        super(message);
    }
}

export default SubmissionErrorException