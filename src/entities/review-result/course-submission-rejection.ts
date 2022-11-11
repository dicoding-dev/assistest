import ReviewType from "./review-type";
import SubmissionCriteria from "./submission-criteria";
import FailureTest from "../../service/postman-runner/failure-test";
import RejectionType from "./rejection-type";
import InvariantException from "../../exception/invariant-exception";
import ResultTestFailure from "../../service/postman-runner/failure-test";
import RejectException from "../../exception/reject-exception";

class CourseSubmissionRejection {
    get allCriteria(): SubmissionCriteria[] {
        return this._allCriteria;
    }

    criteria = [
        {
            name: 'API dapat menyimpan buku',
            requirements: [
                '[Mandatory] Add Book With Complete Data',
                '[Mandatory] Add Book Without Name',
                '[Mandatory] Add Book with Page Read More Than Page Count'
            ]
        },
        {
            name: 'API dapat menampilkan seluruh buku',
            requirements: [
                '[Mandatory] Get All Books',
            ]
        },
        {
            name: 'API dapat menampilkan detail buku',
            requirements: [
                '[Mandatory] Get Detail Books With Correct Id',
                '[Mandatory] Get Detail Books With Invalid Id'
            ]
        },
        {
            name: 'API dapat mengubah data buku',
            requirements: [
                '[Mandatory] Update Book With Complete Data',
                '[Mandatory] Update Book Without Name',
                '[Mandatory] Update Book With Page Read More Than Page Count',
                '[Mandatory] Update Book with Invalid Id'
            ]
        },
        {
            name: 'API dapat menghapus buku',
            requirements: [
                '[Mandatory] Delete Book with Correct Id',
                '[Mandatory] Delete Book with Invalid Id'
            ]
        }
    ]

    private submissionId = 1
    private reviewType = ReviewType.Reject
    private completedChecklist: Array<number>;
    private reviewerId = 123
    private rating = 0
    private _messages: string
    private reason: string;
    failurePostmanTest: FailureTest[];
    private _allCriteria: SubmissionCriteria[];
    private _unfulfilledCriteria: SubmissionCriteria[];

    constructor({rejectionType, failurePostmanTest, error}: RejectException) {
        this.failurePostmanTest = failurePostmanTest;

        if (rejectionType === RejectionType.TestError) {
            this.composeRejectionMessageFromCriteria(failurePostmanTest)
        }

        if (rejectionType === RejectionType.ProjectError) {
            this.composeRejectionMessageFromProjectErrorMessage(error)
        }

        if (rejectionType === RejectionType.ServerError) {
            this.composeRejectionMessageFromServerErrorMessage(error)
        }

        this._allCriteria = this.criteria.map(criteria => {
            const unfulfilledRequirement = failurePostmanTest.filter(testResult => criteria.requirements.includes(testResult.name))
            return <SubmissionCriteria>{
                name: criteria.name,
                reason: unfulfilledRequirement ?? [],
                pass: error ? false : unfulfilledRequirement.length < 1,
                requirement: criteria.requirements
            }
        })

        this._unfulfilledCriteria = this._allCriteria.filter(criteria => criteria.pass === false);
    }



    private composeRejectionMessageFromCriteria(failurePostmanTest: Array<FailureTest>) {
        const greeting = 'Masih terdapat error yang terjadi saat posting testing dijalankan, error yang muncul ada postman adalah sebagai berikut'
        const closing = 'Pastikan semua test yang bersifat mandatory bisa berjalan semua, silakan diperbaiki yaa.'
        let container = ''
        failurePostmanTest.forEach(failedTest => {
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

    private composeRejectionMessageFromServerErrorMessage(error: InvariantException) {
        this._messages = `Project yang kamu buat masih belum bisa dijalankan dengan baik, hal ini terjadi karena ${error.message}`
    }

    get messages(): string {
        return this._messages;
    }

    get unfulfilledCriteria(): SubmissionCriteria[] {
        return this._unfulfilledCriteria;
    }
}

export default CourseSubmissionRejection