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
import Reject from "./entities/review-result/reject";
import RejectionType from "./entities/review-result/rejection-type";
import RejectException from "./exception/reject-exception";
import rejectException from "./exception/reject-exception";

const createSubmissionProject = (submission) => {
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
            throw new RejectException(RejectionType.ServerError, [], e)
        }

        throw e
    }
}

const validateMandatoryCriteria = (failurePostmanTest: Array<ResultTestFailure>) => {
    const rejection = new RejectException(RejectionType.TestError, failurePostmanTest)
    // if (rejection.unfulfilledCriteria.length > 0){
        // throw rejection
    // }
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

            validateMandatoryCriteria(postmanResult)
            const submissionRatingGenerator = new SubmissionRatingGenerator(postmanResult, checkEslint(submissionProject))

            console.log(`is approved: true`)
            console.log(`rating: ${submissionRatingGenerator.rating}`)
        } catch (e) {
            if (e instanceof RejectException) {
                const reject = new Reject(e)
                console.log(`is approved: false`)
                console.log(`rating: 0`)
                console.log(`reason: ${reject.messages}`)
                console.log(`unfulfilled criteria: ${reject.criteria.map(e => e.name).join('\n')}`)
            } else {
                console.log(e)
            }
        }
        console.log()
    }
}

main()