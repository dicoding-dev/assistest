import ResultTestFailure from "../service/postman-runner/failure-test";

abstract class SubmissionErrorException extends Error{
    code: string
    additionalMessage: string
    serverErrorLog: string[]
    failurePostmanTest: ResultTestFailure[]

    protected constructor(code: string) {
        super(code);
    }
}

export default SubmissionErrorException