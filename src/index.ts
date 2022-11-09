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
import MandatoryCriteriaChecker from "./entities/review-result/mandatory-criteria-checker";
import ResultTestFailure from "./service/postman-runner/failure-test";
import SubmissionRatingGenerator from "./entities/review-result/submission-rating-generator";
import RejectionReason from "./entities/rejection-reason/rejection-reason";

const createSubmissionProject = (submission) => {
    try {
        const submissionPath = path.resolve('../experiment-storage/project', submission)
        const projectPath = new ProjectPath(submissionPath)
        return new SubmissionProject(projectPath, 'localhost', 5000, 'start')
    } catch (e) {
        if (e instanceof InvariantException) {
            throw new RejectionReason('Project error', new MandatoryCriteriaChecker([], true).unfulfilledCriteria)
        }
        throw e
    }
}

const prepareSubmissionProject = (submissionProject: SubmissionProject) => {
    const projectPreparation = new ProjectPreparation(submissionProject)
    return projectPreparation.install()
}

const startServer = async (submissionProject: SubmissionProject) => {
    const server = new Server()
    await server.run(submissionProject)
    return server
}

const runPostmanTest = async () => {
    const postmanRunner = new PostmanRunner(collection, env)
    return postmanRunner.run()
}

const runServerAndTest = async (submissionProject: SubmissionProject) => {
    try {
        await prepareSubmissionProject(submissionProject)
        const server = await startServer(submissionProject)
        const postmanResult = await runPostmanTest()
        await server.stop()

        return postmanResult
    } catch (e) {
        if (e instanceof InvariantException) {
            const mandatoryCriteriaChecker = new MandatoryCriteriaChecker([], true)
            throw new RejectionReason(e.message, mandatoryCriteriaChecker.allCriteria)
        }

        throw e
    }
}

const getMandatoryCriteria = (failurePostmanTest: Array<ResultTestFailure>) => {
    const mandatoryCriteriaChecker = new MandatoryCriteriaChecker(failurePostmanTest)
    if (!mandatoryCriteriaChecker.approvalStatus) {

        throw new RejectionReason('test error', mandatoryCriteriaChecker.unfulfilledCriteria)
    }
    return mandatoryCriteriaChecker
}

const checkEslint = (submissionProject: SubmissionProject) => {
    const eslintChecker = new EslintChecker(submissionProject)
    return eslintChecker.check()
}

const main = async () => {
    const allSubmission = readdirSync('../experiment-storage/project')

    for (const submission of allSubmission) {

        try {
            const submissionProject = createSubmissionProject(submission)
            console.log(`checking ${submission.toString()}`)

            const postmanResult = await runServerAndTest(submissionProject)

            const mandatoryCriteria = getMandatoryCriteria(postmanResult)
            const submissionRatingGenerator = new SubmissionRatingGenerator(postmanResult, checkEslint(submissionProject))

            console.log(`is approved: true`)
            console.log(`rating: ${submissionRatingGenerator.rating}`)
        } catch (e) {
            if (e instanceof RejectionReason) {
                console.log(`is approved: false`)
                console.log(`rating: 0`)
                console.log(`reason: ${e.reason}`)
                console.log(`unfulfilled criteria: ${e.criteria.map(e => `\n${e.name}`)}`)
            }else {
                console.log(e)
            }
        }
        console.log()
    }
}

main()