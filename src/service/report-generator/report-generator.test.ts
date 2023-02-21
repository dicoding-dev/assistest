import getSubmissionRequirement from "../../config/submission-requirement";
import ReportGenerator from "./report-generator";
import ReviewResult, {ReviewResultStatus} from "../../entities/review-result/course-submission-review/review-result";
import * as fs from "fs";
import PostReviewMethod from "../../entities/review-result/post-review-method";

describe('checklist id resolver test', () => {
    const reportGenerator = new ReportGenerator('./test/student/review-result/')

    it('should generate report properly', function () {
        const submissionRequirement = getSubmissionRequirement()
        submissionRequirement.API_CAN_DELETE_BOOK.status = true
        submissionRequirement.API_CAN_UPDATE_BOOK.status = true
        submissionRequirement.API_CAN_GET_DETAIL_BOOK.status = true
        submissionRequirement.API_CAN_GET_ALL_BOOK.status = true
        submissionRequirement.API_CAN_INSERT_BOOK.status = true
        submissionRequirement.PROJECT_HAVE_CORRECT_RUNNER_SCRIPT.status = true
        submissionRequirement.PROJECT_HAVE_CORRECT_PORT.status = true


        const reviewResult: ReviewResult = {
            rating: 5,
            status: ReviewResultStatus.Approve,
            checklist: submissionRequirement,
            message: 'Selamat',
            postReviewMethod: PostReviewMethod.Draft
        }

        const studentProjectPath = './test/student-project/project-with-correct-autoreview-config'
        reportGenerator.generate(reviewResult, studentProjectPath)

        const result = JSON.parse(fs.readFileSync('./test/student/review-result/report.json').toString())[0]

        expect(result.checklist.PROJECT_HAVE_CORRECT_RUNNER_SCRIPT.checklistId).toStrictEqual(42150)
        expect(result.checklist.PROJECT_HAVE_CORRECT_PORT.checklistId).toStrictEqual(42145)
        expect(result.checklist.API_CAN_INSERT_BOOK.checklistId).toStrictEqual(42120)
        expect(result.checklist.API_CAN_GET_ALL_BOOK.checklistId).toStrictEqual(42125)
        expect(result.checklist.API_CAN_GET_DETAIL_BOOK.checklistId).toStrictEqual(42130)
        expect(result.checklist.API_CAN_UPDATE_BOOK.checklistId).toStrictEqual(42135)
        expect(result.checklist.API_CAN_DELETE_BOOK.checklistId).toStrictEqual(42140)
        expect(result.checklist_completed).toEqual([42145, 42150, 42120, 42125, 42130, 42135, 42140])
        expect(result.message).toStrictEqual('<p>Hallo <strong>snder12</strong>, terima kasih telah sabar menunggu. Kami membutuhkan waktu untuk bisa memberikan <em>feedback</em> sekomprehensif mungkin kepada setiap peserta kelas. Dalam kesempatan ini ada &nbsp;4 (empat) hal yang ingin kami sampaikan.&nbsp;</p><p><strong>Pertama</strong>, kami ingin mengucapkan selamat! Karena kamu telah menyelesaikan tugas submission dari kelas Belajar Membuat Aplikasi Back-End untuk Pemula. Jangan lihat bintang yang kamu raih, tapi lihat kemajuan yang sudah kamu capai. Ingat semua <em>expert&nbsp;</em>dahulu pemula.&nbsp;</p><p><strong>K</strong><strong>edua</strong>, kamu boleh bangga karena telah menyelesaikan submission sesuai dengan kriteria yang telah kami tentukan. Mumpung masih hangat semangatnya langsung lanjut kelas selanjutnya yaitu <a href="https://www.dicoding.com/academies/266">Architecting on AWS (Membangun Arsitektur AWS di Cloud)</a> atau <a href="https://www.dicoding.com/academies/271">Belajar Fundamental Aplikasi Back-End</a>.&nbsp;</p><p><strong>Ketiga</strong>, beberapa lulusan tidak tahu mereka memiliki akses kelas selamanya. Sebagai informasi kelas Dicoding selalu <em>update&nbsp;</em>sehingga memiliki perbedaan minimal 30% dari sejak kelas dirilis. Silakan mampir kembali untuk melihat materi saat kamu membutuhkan <em>update</em>.&nbsp;</p><p><strong>K</strong><strong>eempat</strong>, karena sudah praktik langsung maka kamu sudah menguasai ilmu kelas dasar ini antara 75-90%. Salah satu cara agar meningkatkan penguasaan ilmu agar bisa lebih maksimal (&gt;90%) adalah dengan memperbanyak latihan atau mengajarkan ilmu kepada orang lain.</p><p>Salah satu misi Dicoding adalah menyebarkan ilmu yang bermanfaat. Kami berusaha membangun kurikulum standar global dengan harapan agar developer Indonesia bisa menjadi jawara di negeri sendiri. Namun misi ini tidak akan tercapai tanpa kolaborasi dari kita semua.</p><hr><p>Supaya aplikasimu menjadi lebih baik lagi, berikut <em>beberapa</em> <em>catatan</em> terkait submission kamu:</p><ul>Selamat</ul><hr><p>Silakan berkunjung ke <a href="https://www.dicoding.com/academies/261/discussions">academy discussion</a> untuk mengasah penguasaan ilmu kamu dan membuat ilmu yang kamu dapatkan bisa semakin berkah dan bermanfaat dengan membantu kawan-kawan kita yang saat ini masih berjuang.</p><p>Terima kasih telah membantu misi kami. Kesuksesan developer Indonesia adalah energi bagi kami. Jika memiliki pertanyaan atau saran terkait kelas, silakan email ke <a href="mailto:%20academy@dicoding.com" rel="noreferrer noopener" target="_blank">academy@dicoding.com</a>.</p><hr><p style="text-align:right;"><em>Salam</em></p><p style="text-align:right;"><span style="color:rgb(226,80,65);">Dicoding Reviewer</span></p>')
    });
})

