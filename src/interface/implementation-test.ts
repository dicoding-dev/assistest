import {readdirSync} from "fs";
import {join} from "path";
import {main} from "../service-provider";
import ReportGenerator from "../service/report-generator/report-generator";

async function run() {
    const experimentStorageProjectPath = join(process.cwd(), 'experiment-storage', 'project')
    const allSubmission = readdirSync(experimentStorageProjectPath)

    for (const submission of allSubmission) {
        console.log(`checking ${submission}`)
        const submissionPath = join(experimentStorageProjectPath, submission)
        const reviewResult = await main.reviewSubmission(submissionPath)
        const reportGenerator = new ReportGenerator(submissionPath)
        reportGenerator.generate(reviewResult, submission)
    }
}

run()

