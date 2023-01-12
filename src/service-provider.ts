import PostmanRunner from "./service/postman-runner/postman-runner";
import postmanRequirements from "./config/postman-requirements";
import ServerService from "./service/server/server-service";
import ProjectPreparationService from "./service/project-preparation/project-preparation-service";
import EslintChecker from "./service/eslint-checker/eslint-checker";
import * as collection from './config/collection.json'
import * as env from './config/environment.json'
import Main from "./index";
import SubmissionCriteriaCheckFactory from "./factories/submission-criteria-check/submission-criteria-check-factory";
import SubmissionProjectFactory from "./factories/submission-project/submission-project-factory";
import PackageJsonFinderService from "./service/project-path-finder/package-json-finder-service";

const postmanRunner = new PostmanRunner(collection, env)
const submissionCriteriaCheckFactory = new SubmissionCriteriaCheckFactory(postmanRequirements)
const submissionProjectFactory = new SubmissionProjectFactory()
const serverService = new ServerService()
const projectPreparationService = new ProjectPreparationService()
const eslintChecker = new EslintChecker()
const packageJsonFinderService = new PackageJsonFinderService()

const main = new Main(
    postmanRunner,
    serverService,
    projectPreparationService,
    eslintChecker,
    packageJsonFinderService,
    submissionProjectFactory,
    submissionCriteriaCheckFactory)

export {main}


