import exceptionToReviewMessage from "../../../exception/exception-to-review-message";
import SubmissionRatingFactory from "../../../factories/submission-rating/submission-rating-factory";
import SubmissionCriteriaCheck from "../submission-criteria-check/submission-criteria-check";
import {SubmissionRequirement} from "../../../config/submission-requirement";


class CourseSubmissionAcception {
    private _rating = 0
    private _messages: string
    private submissionRatingGenerator: SubmissionRatingFactory;
    private readonly _reviewChecklistResults: SubmissionRequirement;
    private submissionCriteriaCheck: SubmissionCriteriaCheck;

    constructor(submissionCriteriaCheck: SubmissionCriteriaCheck, submissionRatingGenerator: SubmissionRatingFactory) {
        this.submissionRatingGenerator = submissionRatingGenerator;
        this._reviewChecklistResults = submissionCriteriaCheck.reviewChecklistResult;
        this.submissionCriteriaCheck = submissionCriteriaCheck
    }

    accept() {
        this._rating = this.submissionRatingGenerator.rating
        this._messages = this.getMessage()
    }

    private getMessage() {
        const messageFromEslint = this.getMessageFromEslint()
        const messageFromOptionalTest = this.getMessageFromOptionalTest()
        if (messageFromEslint || messageFromOptionalTest) {
            return messageFromEslint + messageFromOptionalTest
        }
        return '<li>Untuk mengetahui best practices yang ada, terutama penggunaan framework atau tools, cara terbaiknya adalah dengan bereksplorasi kepada dokumentasi resmi yang diberikan. Semakin kamu mengenal frameworknya tentu semakin paham best practice penggunaannya. Silakan eksplorasi dokumentasi beberapa stack framework dan tools yang dapat digunakan pada proyekmu.<ul><li><strong>Hapi Framework</strong>:&nbsp;<a data-mce-href="https://hapi.dev/tutorials/?lang=en_US" data-target-href="https://hapi.dev/tutorials/?lang=en_US" href="https://hapi.dev/tutorials/?lang=en_US" rel="noreferrer nofollow noopener">https://hapi.dev/tutorials/?lang=en_US</a><br>Kamu bisa eksplor tentang apa saja yang bisa digunakan pada framework Hapi.</li><li><strong>Joi</strong>:&nbsp;<a data-mce-href="https://joi.dev/" data-target-href="https://joi.dev/" href="https://joi.dev/" rel="noreferrer nofollow noopener">https://joi.dev/</a><br>Jika kamu ingin membuat validasi data dengan mudah kamu juga bisa menggunakan library Joi.</li><li><strong>Postgres</strong>:&nbsp;<a data-mce-href="https://www.postgresql.org/docs/current/index.html" data-target-href="https://www.postgresql.org/docs/current/index.html" href="https://www.postgresql.org/docs/current/index.html" rel="noreferrer nofollow noopener">https://www.postgresql.org/docs/current/index.html</a><br>Agar aplikasi yang kamu buat datanya bisa bertahan ketika server direstart, kamu bisa mempelajari postrgresql sebagai penyimpanan data.</li><li><strong>node-postgres</strong>:&nbsp;<a data-mce-href="https://node-postgres.com/" data-target-href="https://node-postgres.com/" href="https://node-postgres.com/" rel="noreferrer nofollow noopener">https://node-postgres.com/</a><br>Untuk menghubungkan aplikasi nodejs dengan postgresql kamu bisa menggunakan library node-postgres.</li></ul></li>'
    }


    private getMessageFromOptionalTest(): string {
        if (this.submissionCriteriaCheck.failurePostmanTest?.length > 0) {
            let container = ''
            this.submissionCriteriaCheck.failurePostmanTest.forEach(failedTest => {
                let list = `<li><b>${failedTest.name}</b><ul>`
                failedTest.tests.forEach(test => {
                    list += `<li>Nama test: ${test.test}<br>Pesan error: ${test.message}</li>`
                })
                container += `${list}</ul></li>`
            })
            return `<li>Masih terdapat beberapa test yang error pada kriteria optional<ul>${container}</ul>Sebaiknya diperbaiki agar bisa melatih kemampuan mu dalam membuat aplikasi back-end</li>`
        }
        return ''
    }

    private getMessageFromEslint(): string {
        const eslintCheckResult = this.submissionRatingGenerator.eslintCheckResult
        if (!eslintCheckResult.isSuccess) {
            let message = exceptionToReviewMessage[eslintCheckResult.code]
            if (eslintCheckResult.code === 'ESLINT_ERROR') {
                const formattedLog = this.ellipsisEslintLogError(eslintCheckResult.reason)
                message += `<pre>${formattedLog}</pre>`
            }
            return `<li>${message}</li>`
        }

        return ''
    }

    //this function will create ellipsis between 10 first line and 10 last line if total line more than 10
    private ellipsisEslintLogError(eslintLog: string): string {
        const totalLines = eslintLog.split("\n").length

        if (totalLines > 20 && !eslintLog.includes('Oops! Something went wrong')) {
            const firstIndexOfLine = 10
            const lastIndexOfLine = 10

            const firstIndex = eslintLog.split("\n", firstIndexOfLine).join("\n").length
            const lastIndex = eslintLog.split("\n", totalLines - lastIndexOfLine).join("\n").length
            return eslintLog.substring(0, firstIndex) + '\n\n...\n\n' + eslintLog.substring(lastIndex + 1);
        }

        return eslintLog
    }


    get messages(): string {
        return this._messages;
    }

    get rating(): number {
        return this._rating;
    }

    get reviewChecklistResults():  SubmissionRequirement {
        return this._reviewChecklistResults;
    }
}

export default CourseSubmissionAcception