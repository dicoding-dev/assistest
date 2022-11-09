import Review from "./reject";
import SubmissionCriteria from "./submission-criteria";
import ResultTestFailure from "../../service/postman-runner/failure-test";
import RejectionType from "./rejection-type";
import InvariantException from "../../exception/invariant-exception";

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
        const review = new Review(RejectionType.TestError, '', [], failurePostmanTest)


        expect(review.messages).toStrictEqual(`
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
        const review = new Review(RejectionType.ProjectError, '', [], [], new InvariantException('Submission path is not found'))
        expect(review.messages).toStrictEqual('Project yang kamu buat masih belum memenuhi kriteria submission, hal ini terjadi karena Submission path is not found')
    });
})