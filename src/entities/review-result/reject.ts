import ReviewType from "./review-type";
import SubmissionCriteria from "./submission-criteria";
import FailureTest from "../../service/postman-runner/failure-test";
import RejectionType from "./rejection-type";
import InvariantException from "../../exception/invariant-exception";

class Review {
    get messages(): string {
        return this._messages;
    }

    private submissionId = 1
    private reviewType = ReviewType.Reject
    private completedChecklist: Array<number>;
    private reviewerId = 123
    private rating = 0
    private _messages: string
    private reason: string;
    failedPostmanTest: FailureTest[];

    constructor(rejectionType: RejectionType, reason: string, unfulfilledCriteria: Array<SubmissionCriteria>, failedPostmanTest: Array<FailureTest>, error?: InvariantException) {
        this.reason = reason;
        this.failedPostmanTest = failedPostmanTest;

        if (rejectionType === RejectionType.TestError) {
            this.composeRejectionMessageFromCriteria(failedPostmanTest)
        }

        if (rejectionType === RejectionType.ProjectError){
            this.composeRejectionMessageFromProjectErrorMessage(error)
        }
    }

    private composeRejectionMessageFromCriteria(failedPostmanTest: Array<FailureTest>) {
        const greeting = 'Masih terdapat error yang terjadi saat posting testing dijalankan, error yang muncul ada postman adalah sebagai berikut'
        const closing = 'Pastikan semua test yang bersifat mandatory bisa berjalan semua, silakan diperbaiki yaa.'
        let container = ''
        failedPostmanTest.forEach(failedTest => {
            let list = `<li><b>${failedTest.name}</b><ul>`
            failedTest.tests.forEach(test => {
                list += `<li>Nama test: ${test.test}<br>Pesan error: ${test.message}</li>`
            })
            container += `${list}</ul></li>`
        })
        this._messages = `${greeting}<ul>${container}</ul>${closing}`
    }

    private composeRejectionMessageFromProjectErrorMessage(error: InvariantException) {
        this._messages = `Project yang kamu buat masih belum memenuhi kriteria submission, hal ini terjadi karena ${error.message}`
    }
}

export default Review