import {readdirSync} from "fs";
import {join} from "path";
import * as path from "path";
import {main} from "../service-provider";
import ReportGenerator from "../service/report-generator/report-generator";

const reportGenerator = new ReportGenerator('./report')
async function run() {
    const allSubmission = readdirSync(join(process.cwd(), 'experiment-storage', 'project'))

    for (const submission of allSubmission) {
        console.log(`checking ${submission}`)
        const submissionPath = path.resolve('../experiment-storage/project', submission)
        const reviewResult = await main.reviewSubmission(submissionPath)
        reportGenerator.generate(reviewResult, submission)
    }
}

run()

