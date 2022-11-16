import {readdirSync, writeFileSync} from "fs";
import * as path from "path";
import SubmissionProject from "./entities/submission-project/submission-project";
import ProjectPath from "./entities/project-path/project-path";
import ProjectPreparation from "./service/project-preparation/project-preparation";
import Server from "./service/server/server";
import PostmanRunner from "./service/postman-runner/postman-runner"
import * as collection from '../../experiment-storage/postman/collection.json'
import * as env from '../../experiment-storage/postman/environment.json'
import EslintChecker from "./service/eslint-checker/eslint-checker";
import ResultTestFailure from "./service/postman-runner/failure-test";
import SubmissionCriteriaCheck from "./entities/review-result/submission-criteria-check/submission-criteria-check";
import backendPemulaChecklist from "./conifg/backend-pemula-checklist";
import ReviewResult from "./entities/review-result/review-result";
import SubmissionErrorException from "./exception/submission-error-excepion";
import CourseSubmissionReview from "./entities/review-result/course-submission-review/course-submission-review";

let html = `<table border="1">
    <tr>
         <td>Submission</td>
        <td>Status</td>
        <td>Rating</td>
        <td>Message</td>
        <td>Checklist</td>
    </tr>`

class Main {
    async main() {
        const allSubmission = readdirSync('../experiment-storage/project')
        for (const submission of allSubmission) {
            const reviewResult = await this.reviewSubmission(submission)
            this.showReviewResult(reviewResult, submission)
            writeFileSync('./report/index.html', html)
        }
        html += `</table>`
    }

    private async reviewSubmission(submission: string) {
        let postmanResult = []
        let submissionProject: SubmissionProject = null
        let submissionErrorException: SubmissionErrorException = null
        try {
            console.log(`checking ${submission.toString()}`)
            submissionProject = this.createSubmissionProject(submission)
            postmanResult = await this.runServerAndTest(submissionProject)
        } catch (e) {
            if (e instanceof SubmissionErrorException) {
                submissionErrorException = e
            } else {
                console.log(e)
            }
        }

        return this.generateReviewResult(submissionProject, postmanResult, submissionErrorException)
    }

    private generateReviewResult(submissionProject, postmanResult, submissionErrorException) {
        const submissionCriteriaCheck = this.submissionCriteriaCheck(postmanResult, !!submissionErrorException)
        const eslintCheckResult = this.checkEslint(submissionProject, submissionCriteriaCheck.approvalStatus)
        const courseSubmissionReview = new CourseSubmissionReview(submissionCriteriaCheck, postmanResult, eslintCheckResult)
        return courseSubmissionReview.review(submissionErrorException)
    }

    private showReviewResult(reviewResult: ReviewResult, submission: string) {
        console.log("status :", reviewResult.status.toString())
        console.log("rating :", reviewResult.rating)
        console.log("message :", reviewResult.message)
        console.log("unfulfilled checklist :", reviewResult.checklist)

        html += `<tr>
                    <td>${submission}</td>
                    <td>${reviewResult.status.toString()}</td>
                    <td>${reviewResult.rating}</td>
                    <td>${reviewResult.message}</td>
                    <td>${reviewResult.checklist.filter(checklist => checklist.pass == false).map(checklist => checklist.name).join('<br>')}</td>
                </tr>`
    }

    private createSubmissionProject = (submission) => {
        const submissionPath = path.resolve('../experiment-storage/project', submission)
        const projectPath = new ProjectPath(submissionPath)
        return new SubmissionProject(projectPath, 'localhost', 5000, 'start')
    }

    private prepareSubmissionProject = (submissionProject: SubmissionProject) => {
        const projectPreparation = new ProjectPreparation(submissionProject)
        return projectPreparation.install()
    }

    private startServer = async (submissionProject: SubmissionProject) => {
        const server = new Server()
        await server.run(submissionProject)
        return server
    }

    private runPostmanTest = async () => {
        const postmanRunner = new PostmanRunner(collection, env)
        return postmanRunner.run()
    }

    private runServerAndTest = async (submissionProject: SubmissionProject) => {
        await this.prepareSubmissionProject(submissionProject)
        const server = await this.startServer(submissionProject)
        const postmanResult = await this.runPostmanTest()
        await server.stop()

        return postmanResult
    }

    private submissionCriteriaCheck = (failurePostmanTest: Array<ResultTestFailure>, isProjectError: boolean) => {
        const submissionCriteriaCheck = new SubmissionCriteriaCheck(backendPemulaChecklist, failurePostmanTest, isProjectError)
        submissionCriteriaCheck.check()

        return submissionCriteriaCheck
    }

    private checkEslint = (submissionProject: SubmissionProject, approvalStatus: boolean) => {
        if (!approvalStatus) {
            return null
        }
        const eslintChecker = new EslintChecker(submissionProject)
        return eslintChecker.check()
    }
}

new Main().main()