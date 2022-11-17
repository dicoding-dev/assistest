import {readdirSync, writeFileSync} from "fs";
import * as path from "path";
import {main} from "../service-provider";
import ReviewResult from "../entities/review-result/course-submission-review/review-result";


async function run() {
    const allSubmission = readdirSync('../experiment-storage/project')

    for (const submission of allSubmission) {
        console.log(`checking ${submission}`)
        const submissionPath = path.resolve('../experiment-storage/project', submission)
        const reviewResult = await main.reviewSubmission(submissionPath)
        generateReport(reviewResult, submission)
    }
}

let rows = ``

function generateReport(reviewResult: ReviewResult, submission: string) {
    rows += `<tr>
                    <td>${submission}</td>
                    <td>${reviewResult.status.toString()}</td>
                    <td>${reviewResult.rating}</td>
                    <td>${reviewResult.message}</td>
                    <td>${reviewResult.checklist.filter(checklist => checklist.pass == false).map(checklist => checklist.name).join('<br>')}</td>
                </tr>`

    const html = `
    <table border="1">
    <tr>
         <td>Submission</td>
        <td>Status</td>
        <td>Rating</td>
        <td>Message</td>
        <td>Checklist</td>
    </tr>
    ${rows}
    </table>`
    writeFileSync('./report/index.html', html)
}

run()

