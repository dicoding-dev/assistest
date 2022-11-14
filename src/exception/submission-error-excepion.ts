import ResultTestFailure from "../service/postman-runner/failure-test";

abstract class SubmissionErrorException extends Error{
    code: string
    message: string
    serverErrorLog: string[]
    failurePostmanTest: ResultTestFailure[]
}

export default SubmissionErrorException