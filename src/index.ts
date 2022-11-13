import {readdirSync} from "fs";
import * as path from "path";
import SubmissionProject from "./entities/submission-project/submission-project";
import ProjectPath from "./entities/project-path/project-path";
import ProjectPreparation from "./service/project-preparation/project-preparation";
import Server from "./service/server/server";
import PostmanRunner from "./service/postman-runner/postman-runner"
import * as collection from '../../experiment-storage/postman/collection.json'
import * as env from '../../experiment-storage/postman/environment.json'
import EslintChecker from "./service/eslint-checker/eslint-checker";
import InvariantException from "./exception/invariant-exception";
import ResultTestFailure from "./service/postman-runner/failure-test";
import SubmissionRatingGenerator from "./entities/review-result/submission-rating-generator";
import RejectionType from "./entities/review-result/rejection-type";
import RejectException from "./exception/reject-exception";
import SubmissionCriteriaCheck from "./entities/review-result/submission-criteria-check/submission-criteria-check";
import backendPemulaChecklist from "./conifg/backend-pemula-checklist";
import CourseSubmissionRejection
    from "./entities/review-result/course-submission-rejection/course-submission-rejection";
import ReviewResult, {ReviewResultStatus} from "./entities/review-result/review-result";

class Main {
    async main() {
        const allSubmission = readdirSync('../experiment-storage/project')
        let reviewResult

        for (const submission of allSubmission) {
            try {
                const submissionProject = this.createSubmissionProject(submission)
                console.log(`checking ${submission.toString()}`)

                const postmanResult = await this.runServerAndTest(submissionProject)
                const submissionCriteriaCheck = this.submissionCriteriaCheck(postmanResult)
                reviewResult = this.generateApproval(submissionProject, postmanResult, submissionCriteriaCheck)
            } catch (e) {
                if (e instanceof RejectException) {
                    reviewResult = this.generateRejection(e)
                } else {
                    console.log(e)
                }
            }

            this.showReviewResult(reviewResult)
        }
    }

    private showReviewResult(reviewResult: ReviewResult) {
        console.log("status :", reviewResult.status.toString())
        console.log("rating :",reviewResult.rating)
        console.log("message :",reviewResult.message)
        console.log("checklist :",reviewResult.checklist)

        console.log()
    }

    private generateApproval(submissionProject: SubmissionProject, postmanResult: Array<ResultTestFailure>, submissionCriteriaCheck: SubmissionCriteriaCheck): ReviewResult{
        const submissionRatingGenerator = new SubmissionRatingGenerator(postmanResult, this.checkEslint(submissionProject))

        return <ReviewResult>{
            rating: submissionRatingGenerator.rating,
            message: 'Congrats',
            status: ReviewResultStatus.Approve,
            checklist: submissionCriteriaCheck.reviewChecklistResult
        }
    }

    private generateRejection(rejectException: RejectException): ReviewResult {
        const submissionCriteriaCheck = new SubmissionCriteriaCheck(backendPemulaChecklist, [], true)
        submissionCriteriaCheck.check()

        const courseSubmissionRejection = new CourseSubmissionRejection(rejectException, submissionCriteriaCheck.reviewChecklistResult)
        courseSubmissionRejection.reject()


        return <ReviewResult>{
            rating: 0,
            message: courseSubmissionRejection.messages,
            status: ReviewResultStatus.Reject,
            checklist: courseSubmissionRejection.reviewChecklistResults
        }
    }

    private createSubmissionProject = (submission) => {
        try {
            const submissionPath = path.resolve('../experiment-storage/project', submission)
            const projectPath = new ProjectPath(submissionPath)
            return new SubmissionProject(projectPath, 'localhost', 5000, 'start')
        } catch (e) {
            if (e instanceof InvariantException) {
                throw new RejectException(RejectionType.ProjectError, [], e)
            }
            throw e
        }
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
        try {
            await this.prepareSubmissionProject(submissionProject)
            const server = await this.startServer(submissionProject)
            const postmanResult = await this.runPostmanTest()
            await server.stop()

            return postmanResult
        } catch (e) {
            if (e instanceof InvariantException) {
                throw new RejectException(RejectionType.ServerError, [], e)
            }

            throw e
        }
    }

    private submissionCriteriaCheck = (failurePostmanTest: Array<ResultTestFailure>) => {
        const submissionCriteriaCheck = new SubmissionCriteriaCheck(backendPemulaChecklist, failurePostmanTest)
        submissionCriteriaCheck.check()

        if (submissionCriteriaCheck.approvalStatus === false) {
            throw new RejectException(RejectionType.TestError, failurePostmanTest)
        }

        return submissionCriteriaCheck
    }

    private checkEslint = (submissionProject: SubmissionProject) => {
        const eslintChecker = new EslintChecker(submissionProject)
        return eslintChecker.check()
    }

}

new Main().main()