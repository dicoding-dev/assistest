import ResultTestFailure from "../../service/postman-runner/failure-test";
import SubmissionCriteriaCheck from "../../entities/review-result/submission-criteria-check/submission-criteria-check";
import {SubmissionRequirement} from "../../config/submission-requirement"


class SubmissionCriteriaCheckFactory {

    public check(submissionRequirements: SubmissionRequirement, failurePostmanTest: Array<ResultTestFailure> = null): SubmissionCriteriaCheck{

        const postmanRequirements = [
            submissionRequirements.api_can_insert_book,
            submissionRequirements.api_can_get_all_book,
            submissionRequirements.api_can_get_detail_book,
            submissionRequirements.api_can_update_book,
            submissionRequirements.api_can_delete_book
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
