import ResultTestFailure from "../../service/postman-runner/failure-test";
import SubmissionCriteria from "./submission-criteria";

class MandatoryCriteriaChecker {
    private readonly _unfulfilledCriteria: Array<SubmissionCriteria>
    private readonly _allCriteria: Array<SubmissionCriteria>

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
            name: ' API dapat menghapus buku',
            requirements: [
                '[Mandatory] Delete Book with Correct Id',
                '[Mandatory] Delete Book with Invalid Id'
            ]
        }
    ]

    constructor(failurePostmanTest: Array<ResultTestFailure>) {
        this._allCriteria = this.criteria.map(criteria => {
            const unfulfilledRequirement = failurePostmanTest.filter(testResult => criteria.requirements.includes(testResult.name))
            return <SubmissionCriteria>{
                name: criteria.name,
                unfulfilledRequirement,
                pass: unfulfilledRequirement.length < 1,
                requirement: criteria.requirements
            }
        })

        this._unfulfilledCriteria = this._allCriteria.filter(criteria => criteria.pass === false);
    }

    get approvalStatus(): boolean {
        return this._unfulfilledCriteria.length < 1
    }

    get unfulfilledCriteria(): Array<SubmissionCriteria> {
        return this._unfulfilledCriteria
    }

    get allCriteria(): Array<SubmissionCriteria> {
        return this._allCriteria;
    }
}

export default MandatoryCriteriaChecker