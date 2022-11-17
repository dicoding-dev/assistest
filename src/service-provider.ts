import PostmanRunner from "./service/postman-runner/postman-runner";
import SubmissionProjectFactory from "./entities/submission-project/submission-project-factory";
import SubmissionCriteriaCheckFactory
    from "./entities/review-result/submission-criteria-check/submission-criteria-check-factory";
import backendPemulaChecklist from "./conifg/backend-pemula-checklist";
import ServerService from "./service/server/server-service";
import ProjectPreparationService from "./service/project-preparation/project-preparation-service";
import EslintChecker from "./service/eslint-checker/eslint-checker";
import PackageJsonFinderService from "./entities/project-path/package-json-finder-service";
import * as collection from '../../experiment-storage/postman/collection.json'
import * as env from '../../experiment-storage/postman/environment.json'
import Main from "./index";

const postmanRunner = new PostmanRunner(collection, env)
const submissionCriteriaCheckFactory = new SubmissionCriteriaCheckFactory(backendPemulaChecklist)
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


