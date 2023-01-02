import {main} from "../service-provider";
import {readdirSync} from "fs";
import ReportGenerator from "../service/report-generator/report-generator";
import * as path from "path";

class Cli {
    private mode: string;
    private reportPath: string;
    private folderPath: string;

    constructor() {
        this.getInput()
        this.validateInput()
    }

    async run() {
        const reportGenerator = new ReportGenerator(this.reportPath)

        if (this.mode === 'multi') {
            const allSubmission = readdirSync(this.folderPath)
            for (const submission of allSubmission) {
                console.log(`checking ${submission}`)
                const submissionPath = path.resolve(this.folderPath, submission)
                const reviewResult = await main.reviewSubmission(submissionPath)
                reportGenerator.generate(reviewResult, submission)
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

        if (!this.folderPath){
            throw Error('Submission source is not specified yet')
        }
    }

    private getInput() {
        this.folderPath = process.argv.find(arg => arg.includes('path='))?.replace('path=', '')
        this.mode = process.argv.find(arg => arg.includes('mode=')).replace('mode=', '') ?? 'single'
        this.reportPath = process.argv.find(arg => arg.includes('reportPath='))?.replace('reportPath=', '')
    }
}

console.time('run')
new Cli().run().then(()=> {
    console.timeEnd('run')
})

