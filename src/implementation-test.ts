import ServerService from "./service/server/server-service";
import ProjectPreparationService from "./service/project-preparation/project-preparation-service";
import EslintChecker from "./service/eslint-checker/eslint-checker";
import PackageJsonFinderService from "./entities/project-path/package-json-finder-service";
import PostmanRunner from "./service/postman-runner/postman-runner";
import SubmissionProjectFactory from "./entities/submission-project/submission-project-factory";
import SubmissionCriteriaCheckFactory
    from "./entities/review-result/submission-criteria-check/submission-criteria-check-factory";
import backendPemulaChecklist from "./conifg/backend-pemula-checklist";
import * as collection from '../../experiment-storage/postman/collection.json'
import * as env from '../../experiment-storage/postman/environment.json'
import Main from "./index";
import {readdirSync, writeFileSync} from "fs";
import * as path from "path";
import ReviewResult from "./entities/review-result/review-result";

const postmanRunner = new PostmanRunner(collection, env)
const submissionProjectFactory = new SubmissionProjectFactory()
const submissionCriteriaCheck = new SubmissionCriteriaCheckFactory(backendPemulaChecklist)
const serverService = new ServerService()
const projectPreparationService = new ProjectPreparationService()
const eslintChecker = new EslintChecker()
const packageJsonFinderService = new PackageJsonFinderService()

const main = new Main(postmanRunner,
    serverService,
    projectPreparationService,
    eslintChecker,
    packageJsonFinderService,
    submissionProjectFactory,
    submissionCriteriaCheck)



async function run() {
    const allSubmission = readdirSync('../experiment-storage/project')
    for (const submission of allSubmission) {
        // if (!submission.includes('orevasxilef ')) continue
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

