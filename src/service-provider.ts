import PostmanRunner from "./service/postman-runner/postman-runner";
import ServerService from "./service/server/server-service";
import ProjectPreparationService from "./service/project-preparation/project-preparation-service";
import EslintChecker from "./service/eslint-checker/eslint-checker";
import * as collection from './config/postman/postman-cli/collection.json'
import * as env from './config/postman/postman-cli/environment.json'
import Main from "./index";
import SubmissionCriteriaCheckFactory from "./factories/submission-criteria-check/submission-criteria-check-factory";
import SubmissionProjectFactory from "./factories/submission-project/submission-project-factory";
import PackageJsonFinderService from "./service/project-path-finder/package-json-finder-service";
import ChecklistIdResolver from "./service/checklist-id-resolver/checklist-id-resolver";

const postmanRunner = new PostmanRunner(collection, env)
const submissionCriteriaCheckFactory = new SubmissionCriteriaCheckFactory()
const submissionProjectFactory = new SubmissionProjectFactory()
const serverService = new ServerService()
const projectPreparationService = new ProjectPreparationService()
const eslintChecker = new EslintChecker()
const packageJsonFinderService = new PackageJsonFinderService()
const checklistIdResolver = new ChecklistIdResolver()

const main = new Main(
    postmanRunner,
    serverService,
    projectPreparationService,
    eslintChecker,
    packageJsonFinderService,
    submissionProjectFactory,
    submissionCriteriaCheckFactory,
    checklistIdResolver)

export {main}


