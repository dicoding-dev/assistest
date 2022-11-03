import {readdirSync} from "fs";
import * as path from "path";
import SubmissionProject from "./entities/submission-project/submission-project";
import ProjectPath from "./entities/project-path/project-path";
import ProjectPreparation from "./service/project-preparation/project-preparation";
import Server from "./service/server/server";
import PostmanRunner from "./service/postman-runner/postman-runner"
import * as collection from '../../experiment-storage/postman/collection.json'
import * as env from '../../experiment-storage/postman/environment.json'
import ReviewResult from "./entities/review-result/review-result";
import EslintChecker from "./service/eslint-checker/eslint-checker";
import InvariantException from "./exception/invariant-exception";

const main = async ()=> {
    const allSubmission = readdirSync('../experiment-storage/project')

    for (const submission of allSubmission) {
        try {
        const submissionPath = path.resolve('../experiment-storage/project', submission)
        const projectPath = new ProjectPath(submissionPath)
        console.log(`checking ${projectPath.toString()}`)
        const submissionProject = new SubmissionProject(projectPath, 'localhost', 5000, 'start')

        const projectPreparation = new ProjectPreparation(submissionProject)
        await projectPreparation.install()

        const server = new Server()
        await server.run(submissionProject)

        const postmanRunner = new PostmanRunner(collection, env)
        const postmanResult = await postmanRunner.run()

        const eslintChecker = new EslintChecker(submissionProject)
        const eslintCheck = eslintChecker.check()

        const reviewResult = new ReviewResult(postmanResult, eslintCheck)
        console.log(`is approved: ${reviewResult.approved}`)
        console.log(`rating: ${reviewResult.rating}`)

        await server.stop()
        }catch (e) {
            if (e instanceof InvariantException){
                console.log(`is approved: false`)
                console.log(`rating: 0`)
            }else {
                console.log(e)
            }
        }
    }
}

main()