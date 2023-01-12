import ResultTestFailure from "../../service/postman-runner/failure-test";
import SubmissionCriteriaCheck from "../../entities/review-result/submission-criteria-check/submission-criteria-check";
import {SubmissionRequirement} from "../../config/submission-requirement"


class SubmissionCriteriaCheckFactory {
    private readonly submissionRequirements: SubmissionRequirement;

    constructor(submissionRequirements: SubmissionRequirement) {
        this.submissionRequirements = submissionRequirements;
    }

    public check(failurePostmanTest: Array<ResultTestFailure> = null): SubmissionCriteriaCheck{

        const postmanRequirements = [
            this.submissionRequirements.API_CAN_INSERT_BOOK,
            this.submissionRequirements.API_CAN_GET_ALL_BOOK,
            this.submissionRequirements.API_CAN_GET_DETAIL_BOOK,
            this.submissionRequirements.API_CAN_UPDATE_BOOK,
            this.submissionRequirements.API_CAN_DELETE_BOOK
        ]

        postmanRequirements.forEach(postmanRequirement => {
            const unfulfilledRequirement = failurePostmanTest?.filter(testResult => postmanRequirement.postmanTestRequirements.includes(testResult.name))
            postmanRequirement.status = unfulfilledRequirement?.length < 1
            postmanRequirement.reason = unfulfilledRequirement ?? []
        })

        return {
            reviewChecklistResult: this.submissionRequirements,
            failurePostmanTest,
            approvalStatus: postmanRequirements.filter(criteria => criteria.status === false).length < 1
        }
    }
}

export default SubmissionCriteriaCheckFactory