import ResultTestFailure from "../../service/postman-runner/failure-test";

interface ReviewChecklistResult {
        name: string,
        pass: boolean,
        requirement: Array<string>,
        reason?: Array<ResultTestFailure>
}

export default ReviewChecklistResult