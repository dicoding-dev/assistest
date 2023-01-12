import ResultTestFailure from "../../service/postman-runner/failure-test";
import SubmissionCriteriaCheck from "../../entities/review-result/submission-criteria-check/submission-criteria-check";
import {SubmissionRequirement} from "../../config/submission-requirement"


class SubmissionCriteriaCheckFactory {

    public check(submissionRequirements: SubmissionRequirement, failurePostmanTest: Array<ResultTestFailure> = null): SubmissionCriteriaCheck{

        const postmanRequirements = [
            submissionRequirements.API_CAN_INSERT_BOOK,
            submissionRequirements.API_CAN_GET_ALL_BOOK,
            submissionRequirements.API_CAN_GET_DETAIL_BOOK,
            submissionRequirements.API_CAN_UPDATE_BOOK,
            submissionRequirements.API_CAN_DELETE_BOOK
        ]

        postmanRequirements.forEach(postmanRequirement => {
            const unfulfilledRequirement = failurePostmanTest?.filter(testResult => postmanRequirement.postmanTestRequirements.includes(testResult.name))
            postmanRequirement.status = unfulfilledRequirement?.length < 1
            postmanRequirement.reason = unfulfilledRequirement ?? []
        })

        return {
            reviewChecklistResult: submissionRequirements,
            failurePostmanTest,
            approvalStatus: postmanRequirements.filter(criteria => criteria.status === false).length < 1
        }
    }
}

export default SubmissionCriteriaCheckFactory