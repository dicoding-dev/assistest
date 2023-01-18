import CourseSubmissionRejection from "./course-submission-rejection";
import ResultTestFailure from "../../../service/postman-runner/failure-test";
import PostmanTestFailedException from "../../../exception/postman-test-failed-exception";
import ProjectErrorException from "../../../exception/project-error-exception";
import ServerErrorException from "../../../exception/server-error-exception";
import SubmissionCriteriaCheck from "../submission-criteria-check/submission-criteria-check";

const minifyHtmlRegex = /<!--(.*?)-->|\s\B/gm

describe('reject test', () => {
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
        const submissionCriteriaCheck = <SubmissionCriteriaCheck>{failurePostmanTest}
        const postmanTestFailedException = new PostmanTestFailedException('')
        const courseSubmissionRejection = new CourseSubmissionRejection(postmanTestFailedException, submissionCriteriaCheck)
        courseSubmissionRejection.reject()

        expect(courseSubmissionRejection.messages).toStrictEqual(`
                  Masih terdapat error yang terjadi saat postman testing dijalankan, error yang muncul ada postman adalah sebagai berikut
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
        const submissionCriteriaCheck = <SubmissionCriteriaCheck>{failurePostmanTest: []}
        const exception = new ProjectErrorException('PATH_NOT_CONTAIN_PACKAGE_JSON')
        const courseSubmissionRejection = new CourseSubmissionRejection(exception, submissionCriteriaCheck)
        courseSubmissionRejection.reject()
        expect(courseSubmissionRejection.messages).toContain('Project yang kamu buat masih belum memenuhi kriteria submission, hal ini terjadi karena')
    });

    it('should get message properly when rejection type is server error', function () {
        const submissionCriteriaCheck = <SubmissionCriteriaCheck>{failurePostmanTest: []}
        const exception = new ServerErrorException('PORT_IS_USED')
        const courseSubmissionRejection = new CourseSubmissionRejection(exception, submissionCriteriaCheck)
        courseSubmissionRejection.reject()
        expect(courseSubmissionRejection.messages).toContain('Project yang kamu buat masih belum bisa dijalankan dengan baik, hal ini terjadi')
    });
})