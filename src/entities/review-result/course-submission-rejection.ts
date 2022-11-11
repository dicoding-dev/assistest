import ReviewType from "./review-type";
import ReviewChecklistResult from "./review-checklist-result";
import FailureTest from "../../service/postman-runner/failure-test";
import RejectionType from "./rejection-type";
import InvariantException from "../../exception/invariant-exception";
import RejectException from "../../exception/reject-exception";
import SubmissionChecklist from "../../conifg/submission-checklist";

class CourseSubmissionRejection {
    submissionChecklists: SubmissionChecklist[];
    error: InvariantException;

    private submissionId = 1
    private reviewType = ReviewType.Reject
    private completedChecklist: Array<number>;
    private reviewerId = 123
    private rating = 0
    private _messages: string
    private reason: string;
    failurePostmanTest: FailureTest[];
    private _checklistsResult: ReviewChecklistResult[];
    private _unfulfilledChecklistsResult: ReviewChecklistResult[];
    private rejectionType: RejectionType;

    constructor({rejectionType, failurePostmanTest, error}: RejectException, submissionChecklists: SubmissionChecklist[]) {
        this.rejectionType = rejectionType;
        this.failurePostmanTest = failurePostmanTest;
        this.error = error;
        this.submissionChecklists = submissionChecklists;
    }

    public reject(){
        if (this.rejectionType === RejectionType.TestError) {
            this.composeRejectionMessageFromCriteria(this.failurePostmanTest)
        }

        if (this.rejectionType === RejectionType.ProjectError) {
            this.composeRejectionMessageFromProjectErrorMessage(this.error)
        }

        if (this.rejectionType === RejectionType.ServerError) {
            this.composeRejectionMessageFromServerErrorMessage(this.error)
        }

        this.setSubmissionChecklistResult()
    }

    private setSubmissionChecklistResult(){
        this._checklistsResult = this.submissionChecklists.map(criteria => {
            const unfulfilledRequirement = this.failurePostmanTest.filter(testResult => criteria.requirements.includes(testResult.name))
            return <ReviewChecklistResult>{
                name: criteria.name,
                reason: unfulfilledRequirement ?? [],
                pass: this.error ? false : unfulfilledRequirement.length < 1,
                requirement: criteria.requirements
            }
        })

        this._unfulfilledChecklistsResult = this._checklistsResult.filter(criteria => criteria.pass === false);
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

    get unfulfilledChecklistsResult(): ReviewChecklistResult[] {
        return this._unfulfilledChecklistsResult;
    }

    get checklistsResult(): ReviewChecklistResult[] {
        return this._checklistsResult;
    }
}

export default CourseSubmissionRejection