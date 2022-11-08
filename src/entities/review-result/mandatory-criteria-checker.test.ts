import ResultTestFailure from "../../service/postman-runner/failure-test";
import MandatoryCriteriaChecker from "./mandatory-criteria-checker";

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

        const mandatoryCriteriaChecker = new MandatoryCriteriaChecker(failurePostmanTest)
        expect(mandatoryCriteriaChecker.approvalStatus).toBeFalsy()
        expect(mandatoryCriteriaChecker.unfulfilledCriteria).toStrictEqual([
            {
                name: "API dapat menyimpan buku",
                pass: false,
                requirement: [
                    "[Mandatory] Add Book With Complete Data",
                    "[Mandatory] Add Book Without Name",
                    "[Mandatory] Add Book with Page Read More Than Page Count"
                ],
                unfulfilledRequirement: [
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
                ]
            },
            {
                name: "API dapat menampilkan seluruh buku",
                pass: false,
                requirement: [
                    "[Mandatory] Get All Books"
                ],
                unfulfilledRequirement: [
                    {
                        "name": "[Mandatory] Get All Books",
                        "tests": [
                            {
                                "message": "Failed to add book, 404",
                                "test": "Status code should 200"
                            }
                        ]
                    }
                ]
            }
        ])
    })

    it('should return approval true', function () {
        const failurePostmanTest: Array<ResultTestFailure> = []

        const mandatoryCriteriaChecker = new MandatoryCriteriaChecker(failurePostmanTest)
        expect(mandatoryCriteriaChecker.approvalStatus).toBeTruthy()
        expect(mandatoryCriteriaChecker.unfulfilledCriteria).toStrictEqual([])
        expect(mandatoryCriteriaChecker.allCriteria).toStrictEqual([
            {
                "name": "API dapat menyimpan buku",
                "pass": true,
                "requirement": [
                    "[Mandatory] Add Book With Complete Data",
                    "[Mandatory] Add Book Without Name",
                    "[Mandatory] Add Book with Page Read More Than Page Count"
                ],
                "unfulfilledRequirement": []
            },
            {
                "name": "API dapat menampilkan seluruh buku",
                "pass": true,
                "requirement": [
                    "[Mandatory] Get All Books"
                ],
                "unfulfilledRequirement": []
            },
            {
                "name": "API dapat menampilkan detail buku",
                "pass": true,
                "requirement": [
                    "[Mandatory] Get Detail Books With Correct Id",
                    "[Mandatory] Get Detail Books With Invalid Id"
                ],
                "unfulfilledRequirement": []
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
                "unfulfilledRequirement": []
            },
            {
                "name": " API dapat menghapus buku",
                "pass": true,
                "requirement": [
                    "[Mandatory] Delete Book with Correct Id",
                    "[Mandatory] Delete Book with Invalid Id"
                ],
                "unfulfilledRequirement": []
            }
        ])
    })
})