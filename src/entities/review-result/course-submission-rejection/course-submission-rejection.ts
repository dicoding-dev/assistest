import exceptionToReviewMessage from "../../../exception/exception-to-review-message";
import SubmissionErrorException from "../../../exception/submission-error-exception";
import PostmanTestFailedException from "../../../exception/postman-test-failed-exception";
import ProjectErrorException from "../../../exception/project-error-exception";
import ServerErrorException from "../../../exception/server-error-exception";
import SubmissionCriteriaCheck, {ReviewChecklistResult} from "../submission-criteria-check/submission-criteria-check";
import PostReviewMethod from "../post-review-method";


class CourseSubmissionRejection {

    private _messages: string
    private submissionCriteriaCheck: SubmissionCriteriaCheck;
    private readonly submissionErrorException: SubmissionErrorException;
    private _reviewChecklistResults: ReviewChecklistResult[];

    constructor(submissionErrorException: SubmissionErrorException, submissionCriteriaCheck: SubmissionCriteriaCheck) {
        this.submissionCriteriaCheck = submissionCriteriaCheck;
        this.submissionErrorException = submissionErrorException;
    }

    public reject() {
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
        const greeting = 'Masih terdapat error yang terjadi saat postman testing dijalankan, error yang muncul ada postman adalah sebagai berikut'
        const closing = 'Pastikan semua test yang bersifat mandatory bisa berjalan semua, silakan diperbaiki yaa.'
        let container = ''
        this.submissionCriteriaCheck.failurePostmanTest.forEach(failedTest => {
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
        const translatedException = exceptionToReviewMessage[this.submissionErrorException.message]
        this._messages = `Project yang kamu buat masih belum memenuhi kriteria submission, hal ini terjadi karena ${translatedException}`
    }

    private composeRejectionMessageFromServerErrorMessage() {
        const translatedException = exceptionToReviewMessage[this.submissionErrorException.message] ?? 'ada kesalahan pada project yang kamu buat.'
        const logError = this.submissionErrorException.serverErrorLog.join('\n').replace(/[\u00A0-\u9999<>\&]/g, function (i) {
            return '&#' + i.charCodeAt(0) + ';';
        });
        this._messages = `Project yang kamu buat masih belum bisa dijalankan dengan baik, hal ini terjadi karena ${translatedException} Berikut merupakan log error yang muncul ketika aplikasi dijalankan: <pre>${logError}</pre>`
    }

    get messages(): string {
        return `<li>${this._messages}</li>`
    }

    get reviewChecklistResults(): ReviewChecklistResult[] {
        return this._reviewChecklistResults;
    }

    get postReviewMethod(): PostReviewMethod {
        return this.submissionErrorException.postReviewMethod
    }
}

export default CourseSubmissionRejection
