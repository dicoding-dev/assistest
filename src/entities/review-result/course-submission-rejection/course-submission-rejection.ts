import InvariantException from "../../../exception/invariant-exception";
import ReviewType from "../review-type";
import FailureTest from "../../../service/postman-runner/failure-test";
import ReviewChecklistResult from "../review-checklist-result";
import RejectionType from "../rejection-type";
import RejectException from "../../../exception/reject-exception";
import exceptionToReviewMessage from "../../../exception/exception-to-review-message";


class CourseSubmissionRejection {
    error: InvariantException;

    private submissionId = 1
    private reviewType = ReviewType.Reject
    private completedChecklist: Array<number>;
    private reviewerId = 123
    private rating = 0
    private _messages: string
    failurePostmanTest: FailureTest[];
    private _reviewChecklistResults: ReviewChecklistResult[];
    private _unfulfilledChecklistsResult: ReviewChecklistResult[];
    private rejectionType: RejectionType;

    constructor(rejectException: RejectException, reviewChecklistResults: ReviewChecklistResult[]) {
        this.rejectionType = rejectException.rejectionType;
        this.failurePostmanTest = rejectException.failurePostmanTest;
        this.error = rejectException.error;
        this._reviewChecklistResults = reviewChecklistResults;
    }

    public reject(){
        if (this.rejectionType === RejectionType.TestError) {
            this.composeRejectionMessageFromCriteria()
        }

        if (this.rejectionType === RejectionType.ProjectError) {
            this.composeRejectionMessageFromProjectErrorMessage()
        }

        if (this.rejectionType === RejectionType.ServerError) {
            this.composeRejectionMessageFromServerErrorMessage()
        }
    }

    private composeRejectionMessageFromCriteria() {
        const greeting = 'Masih terdapat error yang terjadi saat posting testing dijalankan, error yang muncul ada postman adalah sebagai berikut'
        const closing = 'Pastikan semua test yang bersifat mandatory bisa berjalan semua, silakan diperbaiki yaa.'
        let container = ''
        this.failurePostmanTest.forEach(failedTest => {
            if (failedTest.name.includes('[Optional]')) return

            let list = `<li><b>${failedTest.name}</b><ul>`
            failedTest.tests.forEach(test => {
                list += `<li>Nama test: ${test.test}<br>Pesan error: ${test.message}</li>`
            })
            container += `${list}</ul></li>`
        })
        this._messages = `${greeting}<ul>${container}</ul>${closing}`
    }

    private composeRejectionMessageFromProjectErrorMessage() {
        const translatedException = exceptionToReviewMessage[this.error.message]
        this._messages = `Project yang kamu buat masih belum memenuhi kriteria submission, hal ini terjadi karena ${translatedException}`
    }

    private composeRejectionMessageFromServerErrorMessage() {
        const translatedException = exceptionToReviewMessage[this.error.message]
        this._messages = `Project yang kamu buat masih belum bisa dijalankan dengan baik, hal ini terjadi karena ${translatedException}`
    }

    get messages(): string {
        return this._messages;
    }

    get unfulfilledChecklistsResult(): ReviewChecklistResult[] {
        return this._unfulfilledChecklistsResult;
    }

    get reviewChecklistResults(): ReviewChecklistResult[] {
        return this._reviewChecklistResults;
    }
}

export default CourseSubmissionRejection