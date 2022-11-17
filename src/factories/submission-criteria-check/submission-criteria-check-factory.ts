import SubmissionChecklist from "../../conifg/submission-checklist";
import ResultTestFailure from "../../service/postman-runner/failure-test";
import SubmissionCriteriaCheck from "../../entities/review-result/submission-criteria-check/submission-criteria-check";
import ReviewChecklistResult from "../../entities/review-result/review-checklist-result";

class SubmissionCriteriaCheckFactory {
    private submissionChecklists: SubmissionChecklist[];

    constructor(submissionChecklists: SubmissionChecklist[]) {
        this.submissionChecklists = submissionChecklists;
    }

    public check(failurePostmanTest: Array<ResultTestFailure> = null): SubmissionCriteriaCheck{
        const reviewChecklistResult = this.submissionChecklists.map(criteria => {
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