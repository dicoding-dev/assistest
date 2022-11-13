import SubmissionCriteriaCheck from "./submission-criteria-check";
import ResultTestFailure from "../../../service/postman-runner/failure-test";
import backendPemulaChecklist from "../../../conifg/backend-pemula-checklist";


describe('mandatory criteria test', () => {
    it('should grouping failed test by criteria and return approval false', function () {
        const failurePostmanTest: Array<ResultTestFailure> = [
            {
                name: '[Mandatory] Add Book With Complete Data',
                tests: [{
                    test: 'Add book with correct id',
                    message: 'Failed to add book, 404',
                }, {
                    test: 'Status code should 201',
                    message: 'Failed to add book, 404',
                }]
            }, {
                name: '[Mandatory] Get All Books',
                tests: [{
                    test: 'Status code should 200',
                    message: 'Failed to add book, 404',
                }]
            }
        ]

        const submissionCriteriaCheck = new SubmissionCriteriaCheck(backendPemulaChecklist, failurePostmanTest)
        submissionCriteriaCheck.check()
        expect(submissionCriteriaCheck.approvalStatus).toBeFalsy()
        expect(submissionCriteriaCheck.reviewChecklistResult).toStrictEqual([
            {
                "name": "API dapat menyimpan buku",
                "pass": false,
                "reason": [
                    {
                        "name": "[Mandatory] Add Book With Complete Data",
                        "tests": [
                            {
                                "message": "Failed to add book, 404",
                                "test": "Add book with correct id"
                            },
                            {
                                "message": "Failed to add book, 404",
                                "test": "Status code should 201"
                            }
                        ]
                    }
                ],
                "requirement": [
                    "[Mandatory] Add Book With Complete Data",
                    "[Mandatory] Add Book Without Name",
                    "[Mandatory] Add Book with Page Read More Than Page Count"
                ]
            },
            {
                "name": "API dapat menampilkan seluruh buku",
                "pass": false,
                "reason": [
                    {
                        "name": "[Mandatory] Get All Books",
                        "tests": [
                            {
                                "message": "Failed to add book, 404",
                                "test": "Status code should 200"
                            }
                        ]
                    }
                ],
                "requirement": [
                    "[Mandatory] Get All Books"
                ]
            },
            {
                "name": "API dapat menampilkan detail buku",
                "pass": true,
                "reason": [],
                "requirement": [
                    "[Mandatory] Get Detail Books With Correct Id",
                    "[Mandatory] Get Detail Books With Invalid Id"
                ]
            },
            {
                "name": "API dapat mengubah data buku",
                "pass": true,
                "reason": [],
                "requirement": [
                    "[Mandatory] Update Book With Complete Data",
                    "[Mandatory] Update Book Without Name",
                    "[Mandatory] Update Book With Page Read More Than Page Count",
                    "[Mandatory] Update Book with Invalid Id"
                ]
            },
            {
                "name": "API dapat menghapus buku",
                "pass": true,
                "reason": [],
                "requirement": [
                    "[Mandatory] Delete Book with Correct Id",
                    "[Mandatory] Delete Book with Invalid Id"
                ]
            }
        ])
    })

    it('should return approval true', function () {
        const failurePostmanTest: Array<ResultTestFailure> = []

        const submissionCriteriaCheck = new SubmissionCriteriaCheck(backendPemulaChecklist,failurePostmanTest)
        submissionCriteriaCheck.check()
        expect(submissionCriteriaCheck.approvalStatus).toBeTruthy()
        expect(submissionCriteriaCheck.reviewChecklistResult).toStrictEqual([
            {
                "name": "API dapat menyimpan buku",
                "pass": true,
                "requirement": [
                    "[Mandatory] Add Book With Complete Data",
                    "[Mandatory] Add Book Without Name",
                    "[Mandatory] Add Book with Page Read More Than Page Count"
                ],
                "reason": []
            },
            {
                "name": "API dapat menampilkan seluruh buku",
                "pass": true,
                "requirement": [
                    "[Mandatory] Get All Books"
                ],
                "reason": []
            },
            {
                "name": "API dapat menampilkan detail buku",
                "pass": true,
                "requirement": [
                    "[Mandatory] Get Detail Books With Correct Id",
                    "[Mandatory] Get Detail Books With Invalid Id"
                ],
                "reason": []
            },
            {
                "name": "API dapat mengubah data buku",
                "pass": true,
                "requirement": [
                    "[Mandatory] Update Book With Complete Data",
                    "[Mandatory] Update Book Without Name",
                    "[Mandatory] Update Book With Page Read More Than Page Count",
                    "[Mandatory] Update Book with Invalid Id"
                ],
                "reason": []
            },
            {
                "name": "API dapat menghapus buku",
                "pass": true,
                "requirement": [
                    "[Mandatory] Delete Book with Correct Id",
                    "[Mandatory] Delete Book with Invalid Id"
                ],
                "reason": []
            }
        ])
    })

    it('should return approval false and all criteria is not passed when project error', function () {
        const submissionCriteriaCheck = new SubmissionCriteriaCheck(backendPemulaChecklist, [], true)
        submissionCriteriaCheck.check()
        expect(submissionCriteriaCheck.approvalStatus).toBeFalsy()
        expect(submissionCriteriaCheck.reviewChecklistResult).toStrictEqual([
            {
                "name": "API dapat menyimpan buku",
                "pass": false,
                "requirement": [
                    "[Mandatory] Add Book With Complete Data",
                    "[Mandatory] Add Book Without Name",
                    "[Mandatory] Add Book with Page Read More Than Page Count"
                ],
                reason: []
            },
            {
                "name": "API dapat menampilkan seluruh buku",
                "pass": false,
                "requirement": [
                    "[Mandatory] Get All Books"
                ],
                reason: []
            },
            {
                "name": "API dapat menampilkan detail buku",
                "pass": false,
                "requirement": [
                    "[Mandatory] Get Detail Books With Correct Id",
                    "[Mandatory] Get Detail Books With Invalid Id"
                ],
                reason: []
            },
            {
                "name": "API dapat mengubah data buku",
                "pass": false,
                "requirement": [
                    "[Mandatory] Update Book With Complete Data",
                    "[Mandatory] Update Book Without Name",
                    "[Mandatory] Update Book With Page Read More Than Page Count",
                    "[Mandatory] Update Book with Invalid Id"
                ],
                reason: []
            },
            {
                "name": "API dapat menghapus buku",
                "pass": false,
                "requirement": [
                    "[Mandatory] Delete Book with Correct Id",
                    "[Mandatory] Delete Book with Invalid Id"
                ],
                reason: []
            }
        ])
    });
})