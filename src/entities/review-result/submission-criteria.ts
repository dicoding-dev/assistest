import ResultTestFailure from "../../service/postman-runner/failure-test";

interface SubmissionCriteria {
        name: string,
        pass: boolean,
        requirement: Array<string>,
        unfulfilledRequirement: Array<ResultTestFailure>
}

export default SubmissionCriteria