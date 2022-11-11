import ResultTestFailure from "../../service/postman-runner/failure-test";
import RejectionType from "./rejection-type";
import InvariantException from "../../exception/invariant-exception";
import RejectException from "../../exception/reject-exception";
import CourseSubmissionRejection from "./course-submission-rejection";
import submissionChecklist from '../../conifg/backend-pemula-checklist'

const minifyHtmlRegex = /<!--(.*?)-->|\s\B/gm


describe('reject test', () => {
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

        const courseSubmissionRejection = new CourseSubmissionRejection(new RejectException(RejectionType.TestError, failurePostmanTest), submissionChecklist)
        courseSubmissionRejection.reject()
        expect(courseSubmissionRejection.unfulfilledCriteria).toStrictEqual([
            {
                name: "API dapat menyimpan buku",
                pass: false,
                requirement: [
                    "[Mandatory] Add Book With Complete Data",
                    "[Mandatory] Add Book Without Name",
                    "[Mandatory] Add Book with Page Read More Than Page Count"
                ],
                reason: [
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
                reason: [
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

        const rejectException = new RejectException(RejectionType.TestError, failurePostmanTest)
        const courseSubmissionRejection = new CourseSubmissionRejection(rejectException, submissionChecklist)
        courseSubmissionRejection.reject()

        expect(courseSubmissionRejection.allCriteria).toStrictEqual([
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
        const failurePostmanTest: Array<ResultTestFailure> = []

        const courseSubmissionRejection = new CourseSubmissionRejection(new RejectException(RejectionType.TestError,failurePostmanTest, new InvariantException('Project error')), submissionChecklist)
        courseSubmissionRejection.reject()

        expect(courseSubmissionRejection.allCriteria).toStrictEqual([
            {
                "name": "API dapat menyimpan buku",
                "pass": false,
                reason: [],
                "requirement": [
                    "[Mandatory] Add Book With Complete Data",
                    "[Mandatory] Add Book Without Name",
                    "[Mandatory] Add Book with Page Read More Than Page Count"
                ]
            },
            {
                "name": "API dapat menampilkan seluruh buku",
                "pass": false,
                reason: [],
                "requirement": [
                    "[Mandatory] Get All Books"
                ]
            },
            {
                "name": "API dapat menampilkan detail buku",
                "pass": false,
                reason: [],
                "requirement": [
                    "[Mandatory] Get Detail Books With Correct Id",
                    "[Mandatory] Get Detail Books With Invalid Id"
                ]
            },
            {
                "name": "API dapat mengubah data buku",
                "pass": false,
                reason: [],
                "requirement": [
                    "[Mandatory] Update Book With Complete Data",
                    "[Mandatory] Update Book Without Name",
                    "[Mandatory] Update Book With Page Read More Than Page Count",
                    "[Mandatory] Update Book with Invalid Id"
                ]
            },
            {
                "name": "API dapat menghapus buku",
                "pass": false,
                reason: [],
                "requirement": [
                    "[Mandatory] Delete Book with Correct Id",
                    "[Mandatory] Delete Book with Invalid Id"
                ]
            }
        ])
    });
    it('should get message properly when rejection type is test error', function () {
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
        const courseSubmissionRejection = new CourseSubmissionRejection(new RejectException(RejectionType.TestError,  failurePostmanTest), submissionChecklist)
        courseSubmissionRejection.reject()


        expect(courseSubmissionRejection.messages).toStrictEqual(`
                  Masih terdapat error yang terjadi saat posting testing dijalankan, error yang muncul ada postman adalah sebagai berikut
                    <ul>
                        <li><b>[Mandatory] Add Book With Complete Data</b>
                            <ul>
                                <li>Nama test: Add book with correct id<br>Pesan error: Failed to add book, 404</li>
                                <li>Nama test: Status code should 201<br>Pesan error: Failed to add book, 404</li>
                            </ul>
                        </li>
                        <li><b>[Mandatory] Get All Books</b>
                            <ul>
                                <li>Nama test: Status code should 200<br>Pesan error: Failed to add book, 404</li>
                            </ul>
                        </li>
                    </ul>Pastikan semua test yang bersifat mandatory bisa berjalan semua, silakan diperbaiki yaa.`
            .replace(minifyHtmlRegex, '').trim())
    });

    it('should get message properly when rejection type is project error', function () {
        const courseSubmissionRejection = new CourseSubmissionRejection( new RejectException(RejectionType.ProjectError, [], new InvariantException('Submission path is not found')), submissionChecklist)
        courseSubmissionRejection.reject()
        expect(courseSubmissionRejection.messages).toStrictEqual('Project yang kamu buat masih belum memenuhi kriteria submission, hal ini terjadi karena Submission path is not found')
    });

    it('should get message properly when rejection type is server error', function () {
        const courseSubmissionRejection = new CourseSubmissionRejection(new RejectException(RejectionType.ServerError,  [], new InvariantException('Port not 5000')), submissionChecklist)
        courseSubmissionRejection.reject()
        expect(courseSubmissionRejection.messages).toStrictEqual('Project yang kamu buat masih belum bisa dijalankan dengan baik, hal ini terjadi karena Port not 5000')
    });
})