import FailureTest from "../../../service/postman-runner/failure-test";
import ReviewChecklistResult from "../review-checklist-result";
import SubmissionRatingGenerator from "../submission-rating-generator";
import exceptionToReviewMessage from "../../../exception/exception-to-review-message";



class CourseSubmissionAcception {
    private submissionId = 1
    private completedChecklist: Array<number>;
    private reviewerId = 123
    private _rating = 0
    private _messages: string
    private failurePostmanTest: FailureTest[];
    private submissionRatingGenerator: SubmissionRatingGenerator;
    private _reviewChecklistResults: ReviewChecklistResult[];

    constructor(reviewChecklistResults: ReviewChecklistResult[], submissionRatingGenerator: SubmissionRatingGenerator) {
        this.submissionRatingGenerator = submissionRatingGenerator;
        this._reviewChecklistResults = reviewChecklistResults;
    }

    accept(){
        this._rating = this.submissionRatingGenerator.rating
        this._messages = this.getMessage()
    }

    private getMessage(){
        return `${this.templateApprovalMessage()} ${this.getMessageFromEslint()}`
    }

    private templateApprovalMessage(): string{
        return 'Congrats.'
    }

    private getMessageFromEslint(): string{
        const eslintCheckResult = this.submissionRatingGenerator.eslintCheckResult
        let message = ''
        if (!eslintCheckResult.isSuccess){
            message = exceptionToReviewMessage[eslintCheckResult.code]
            if (eslintCheckResult.code === 'ESLINT_ERROR'){
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