import ReviewType from "../review-type";
import FailureTest from "../../../service/postman-runner/failure-test";
import ReviewChecklistResult from "../review-checklist-result";
import exceptionToReviewMessage from "../../../exception/exception-to-review-message";
import SubmissionErrorException from "../../../exception/submission-error-excepion";
import PostmanTestFailedException from "../../../exception/postman-test-failed-exception";
import ProjectErrorException from "../../../exception/project-error-exception";
import ServerErrorException from "../../../exception/server-error-exception";


class CourseSubmissionRejection {

    private submissionId = 1
    private reviewType = ReviewType.Reject
    private completedChecklist: Array<number>;
    private reviewerId = 123
    private rating = 0
    private _messages: string
    failurePostmanTest: FailureTest[];
    private submissionErrorException: SubmissionErrorException;
    private _reviewChecklistResults: ReviewChecklistResult[];
    private _unfulfilledChecklistsResult: ReviewChecklistResult[];

    constructor(submissionErrorException: SubmissionErrorException, reviewChecklistResults: ReviewChecklistResult[]) {
        this.submissionErrorException = submissionErrorException;
        this._reviewChecklistResults = reviewChecklistResults;
    }

    public reject(){
        if (this.submissionErrorException instanceof PostmanTestFailedException) {
            this.composeRejectionMessageFromCriteria()
        }

        if (this.submissionErrorException instanceof ProjectErrorException) {
            this.composeRejectionMessageFromProjectErrorMessage()
        }

        if (this.submissionErrorException instanceof ServerErrorException) {
            this.composeRejectionMessageFromServerErrorMessage()
        }
    }

    private composeRejectionMessageFromCriteria() {
        const greeting = 'Masih terdapat error yang terjadi saat posting testing dijalankan, error yang muncul ada postman adalah sebagai berikut'
        const closing = 'Pastikan semua test yang bersifat mandatory bisa berjalan semua, silakan diperbaiki yaa.'
        let container = ''
        this.submissionErrorException.failurePostmanTest.forEach(failedTest => {
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
        const translatedException = exceptionToReviewMessage[this.submissionErrorException.code]
        this._messages = `Project yang kamu buat masih belum memenuhi kriteria submission, hal ini terjadi karena ${translatedException}`
    }

    private composeRejectionMessageFromServerErrorMessage() {
        const translatedException = exceptionToReviewMessage[this.submissionErrorException.code]
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