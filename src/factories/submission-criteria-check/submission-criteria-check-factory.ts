import PostmanRequirement from "../../config/postman-requirement";
import ResultTestFailure from "../../service/postman-runner/failure-test";
import SubmissionCriteriaCheck, {
    ReviewChecklistResult
} from "../../entities/review-result/submission-criteria-check/submission-criteria-check";

class SubmissionCriteriaCheckFactory {
    private postmanRequirements: PostmanRequirement[];

    constructor(postmanRequirements: PostmanRequirement[]) {
        this.postmanRequirements = postmanRequirements;
    }

    public check(failurePostmanTest: Array<ResultTestFailure> = null): SubmissionCriteriaCheck{
        const reviewChecklistResult = this.postmanRequirements.map(criteria => {
            const unfulfilledRequirement = failurePostmanTest?.filter(testResult => criteria.requirements.includes(testResult.name))
            const checklistPass = unfulfilledRequirement?.length < 1
            return <ReviewChecklistResult>{
                name: criteria.name,
                reason: unfulfilledRequirement ?? [],
                pass: checklistPass,
                requirement: criteria.requirements
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