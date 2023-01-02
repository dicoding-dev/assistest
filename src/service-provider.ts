import PostmanRunner from "./service/postman-runner/postman-runner";
import backendPemulaChecklist from "./config/backend-pemula-checklist";
import ContainerService from "./service/server/container-service";
import ProjectPreparationService from "./service/project-preparation/project-preparation-service";
import EslintChecker from "./service/eslint-checker/eslint-checker";
import * as collection from './config/collection.json'
import * as env from './config/environment.json'
import Main from "./index";
import SubmissionCriteriaCheckFactory from "./factories/submission-criteria-check/submission-criteria-check-factory";
import SubmissionProjectFactory from "./factories/submission-project/submission-project-factory";
import PackageJsonFinderService from "./service/project-path-finder/package-json-finder-service";

const postmanRunner = new PostmanRunner(collection, env)
const submissionCriteriaCheckFactory = new SubmissionCriteriaCheckFactory(backendPemulaChecklist)
const submissionProjectFactory = new SubmissionProjectFactory()
const serverService = new ContainerService()
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


