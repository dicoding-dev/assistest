import {main} from "../service-provider";
import {readdirSync} from "fs";
import ReportGenerator from "../service/report-generator/report-generator";
import * as path from "path";
import * as minimist from 'minimist';

class Cli {
    private reportPath: string;
    private folderPath: string;
    private multipleSubmissionStatus: boolean;

    constructor() {
        this.getInput()
        this.validateInput()
    }

    async run() {
        const reportGenerator = new ReportGenerator(this.reportPath)

        if (this.multipleSubmissionStatus) {
            const allSubmission = readdirSync(this.folderPath)
            for (const submission of allSubmission) {
                console.log(`checking ${submission}`)
                const submissionPath = path.resolve(this.folderPath, submission)
                const reviewResult = await main.reviewSubmission(submissionPath)
                reportGenerator.generate(reviewResult, submissionPath)
                console.log()
            }
        } else {
            const submissionPath = path.resolve(this.folderPath)
            const reviewResult = await main.reviewSubmission(submissionPath)
            reportGenerator.generate(reviewResult, submissionPath)
        }
    }

    private validateInput() {
        if (!this.reportPath) {
            throw Error('reportPath must not empty')
        }

        if (!this.folderPath) {
            throw Error('Submission source is not specified yet')
        }
    }

    private getInput() {
        const argv = minimist(process.argv.slice(2));
        this.folderPath = argv.s ?? argv.submissions
        this.multipleSubmissionStatus = argv.m ?? argv.multiple
        this.reportPath = argv.r ?? argv.result
    }
}
new Cli().run()
