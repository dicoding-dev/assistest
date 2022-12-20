import FailureTest from "../../../service/postman-runner/failure-test";
import exceptionToReviewMessage from "../../../exception/exception-to-review-message";
import SubmissionRatingFactory from "../../../factories/submission-rating/submission-rating-factory";
import SubmissionCriteriaCheck, {ReviewChecklistResult} from "../submission-criteria-check/submission-criteria-check";


class CourseSubmissionAcception {
    private submissionId = 1
    private completedChecklist: Array<number>;
    private reviewerId = 123
    private _rating = 0
    private _messages: string
    private failurePostmanTest: FailureTest[];
    private submissionRatingGenerator: SubmissionRatingFactory;
    private _reviewChecklistResults: ReviewChecklistResult[];
    private submissionCriteriaCheck: SubmissionCriteriaCheck;

    constructor(submissionCriteriaCheck: SubmissionCriteriaCheck, submissionRatingGenerator: SubmissionRatingFactory) {
        this.submissionRatingGenerator = submissionRatingGenerator;
        this._reviewChecklistResults = submissionCriteriaCheck.reviewChecklistResult;
        this.submissionCriteriaCheck = submissionCriteriaCheck
    }

    accept() {
        this._rating = this.submissionRatingGenerator.rating
        this._messages = this.getMessage()
    }

    private getMessage() {
        return `${this.templateApprovalMessage()} ${this.getMessageFromEslint()}`
    }

    private templateApprovalMessage(): string {
        if (this.submissionRatingGenerator.rating < 5) {
            return `Masih terdapat beberapa error pada kriteria optional <pre>${JSON.stringify(this.submissionCriteriaCheck.failurePostmanTest)}</pre>`
        }
        return 'Congrats.'
    }

    private getMessageFromEslint(): string {
        const eslintCheckResult = this.submissionRatingGenerator.eslintCheckResult
        let message = ''
        if (!eslintCheckResult.isSuccess) {
            message = exceptionToReviewMessage[eslintCheckResult.code]
            if (eslintCheckResult.code === 'ESLINT_ERROR') {
                message += `<pre>${eslintCheckResult.reason}</pre>`
            }
        }

        return message
    }

    get messages(): string {
        return this._messages;
    }
    get rating(): number {
        return this._rating;
    }

    get reviewChecklistResults(): ReviewChecklistResult[] {
        return this._reviewChecklistResults;
    }
}

export default CourseSubmissionAcception