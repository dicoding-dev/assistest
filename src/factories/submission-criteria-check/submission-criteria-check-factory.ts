import ResultTestFailure from "../../service/postman-runner/failure-test";
import SubmissionCriteriaCheck, {
    ReviewChecklistResult
} from "../../entities/review-result/submission-criteria-check/submission-criteria-check";
import submissionRequirements from "../../config/submisson-requirement"

class SubmissionCriteriaCheckFactory {
    private requirements: typeof submissionRequirements;

    constructor(requirements: typeof submissionRequirements) {
        this.requirements = requirements;
    }

    public check(failurePostmanTest: Array<ResultTestFailure> = null): SubmissionCriteriaCheck{

        const postmanRequirements = [
            this.requirements.API_CAN_INSERT_BOOK,
            this.requirements.API_CAN_GET_ALL_BOOK,
            this.requirements.API_CAN_GET_DETAIL_BOOK,
            this.requirements.API_CAN_UPDATE_BOOK,
            this.requirements.API_CAN_DELETE_BOOK
        ]

        const reviewChecklistResult = postmanRequirements.map(postmanRequirement => {

            const unfulfilledRequirement = failurePostmanTest?.filter(testResult => postmanRequirement.postmanTestRequirements.includes(testResult.name))
            const checklistPass = unfulfilledRequirement?.length < 1
            postmanRequirement.status = checklistPass
            return <ReviewChecklistResult>{
                name: postmanRequirement.postmanTestName,
                reason: unfulfilledRequirement ?? [],
                pass: checklistPass,
                requirement: postmanRequirement.postmanTestRequirements
            }
        })

        return {
            reviewChecklistResult,
            failurePostmanTest,
            approvalStatus: reviewChecklistResult.filter(criteria => criteria.pass === false).length < 1
        }
    }
}

export default SubmissionCriteriaCheckFactory