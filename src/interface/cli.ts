import {main} from "../service-provider";
import {readdirSync} from "fs";

console.log(process.argv)

const folderPath = process.argv.find(arg => arg.includes('path=')).replace('path=', '')
const mode = process.argv.find(arg => arg.includes('mode=')).replace('mode=', '') ?? 'single'

import ReportGenerator from "../service/report-generator/report-generator";
import * as path from "path";

console.time('run')

async function run() {
    const reportGenerator = new ReportGenerator()

    if (mode === 'multi') {
        const allSubmission = readdirSync(folderPath)
        for (const submission of allSubmission) {
            // if (!submission.includes('1572925 christiantokape')) continue
            console.log(`checking ${submission}`)
            const submissionPath = path.resolve(folderPath, submission)
            const reviewResult = await main.reviewSubmission(submissionPath)
            reportGenerator.generate(reviewResult, submission)
            console.log()
        }
    } else {
        const submissionPath = path.resolve(folderPath)
        const reviewResult = await main.reviewSubmission(submissionPath)
        reportGenerator.generate(reviewResult, submissionPath)
    }

    console.timeEnd('run')
    process.exit()

}


run()
