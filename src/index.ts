import ProjectPreparationService from "./service/project-preparation/project-preparation-service";
import ServerService from "./service/server/server-service";
import PostmanRunner from "./service/postman-runner/postman-runner"
import SubmissionErrorException from "./exception/submission-error-excepion";
import CourseSubmissionReview from "./entities/review-result/course-submission-review/course-submission-review";
import PostmanTestFailedException from "./exception/postman-test-failed-exception";
import SubmissionProject from "./entities/submission-project/submission-project";
import EslintChecker from "./service/eslint-checker/eslint-checker";
import PackageJsonFinderService from "./service/project-path-finder/package-json-finder-service";
import SubmissionCriteriaCheckFactory from "./factories/submission-criteria-check/submission-criteria-check-factory";
import ReviewResult from "./entities/review-result/course-submission-review/review-result";
import SubmissionProjectFactory from "./factories/submission-project/submission-project-factory";

class Main {
    private postmanRunner: PostmanRunner;
    private eslintChecker: EslintChecker;
    private projectPreparationService: ProjectPreparationService;
    private serverService: ServerService;
    private packageJsonFinderService: PackageJsonFinderService;
    private submissionCriteriaCheckFactory: SubmissionCriteriaCheckFactory

    constructor(
        postmanRunner: PostmanRunner,
        serverService: ServerService,
        projectPreparationService: ProjectPreparationService,
        eslintChecker: EslintChecker,
        packageJsonFinderService: PackageJsonFinderService,
        submissionProjectFactory: SubmissionProjectFactory,
        submissionCriteriaCheckFactory: SubmissionCriteriaCheckFactory
    ) {
        this.submissionProjectFactory = submissionProjectFactory;
        this.packageJsonFinderService = packageJsonFinderService;
        this.projectPreparationService = projectPreparationService;
        this.serverService = serverService;
        this.postmanRunner = postmanRunner;
        this.eslintChecker = eslintChecker;
        this.submissionCriteriaCheckFactory = submissionCriteriaCheckFactory
    }

    public async reviewSubmission(submissionPath: string): Promise<ReviewResult> {
        let submissionCriteriaCheck = null
        try {
            const submissionProject = this.createSubmissionProject(submissionPath)
            submissionCriteriaCheck = await this.runServerAndTest(submissionProject)

            this.throwErrorIfCriteriaNotFullFilled(submissionCriteriaCheck)

            const eslintCheckResult = this.eslintChecker.check(submissionProject)
            return this.generateReviewResult(submissionCriteriaCheck, eslintCheckResult)
        } catch (e) {
            if (e instanceof SubmissionErrorException) {
                submissionCriteriaCheck = submissionCriteriaCheck ?? this.submissionCriteriaCheckFactory.check()
                return this.generateReviewResult(submissionCriteriaCheck, null, e)
            } else {
                console.log(e)
            }
        }
    }

    private throwErrorIfCriteriaNotFullFilled(submissionCriteriaCheck) {
        if (!submissionCriteriaCheck.approvalStatus) {
            throw new PostmanTestFailedException('')
        }
    }

    private generateReviewResult(submissionCriteriaCheck, eslintCheckResult?, submissionErrorException?) {
        const courseSubmissionReview = new CourseSubmissionReview(submissionCriteriaCheck, eslintCheckResult, submissionErrorException)
        return courseSubmissionReview.review()
    }

    private createSubmissionProject = (submissionPath): SubmissionProject => {
        const projectPath = this.packageJsonFinderService.getPackageJsonDirectory(submissionPath)
        return this.submissionProjectFactory.create(projectPath)
    }

    private runServerAndTest = async (submissionProject: SubmissionProject) => {
        await this.projectPreparationService.install(submissionProject)

        await this.serverService.run(submissionProject)
        const postmanResult = await this.postmanRunner.run()
        await this.serverService.stop()

        return this.submissionCriteriaCheckFactory.check(postmanResult)
    }

    private submissionProjectFactory: SubmissionProjectFactory;
}


export default Main