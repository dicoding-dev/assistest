import EslintChecker from "./eslint-checker";
import SubmissionProjectFactory from "../../entities/submission-project/submission-project-factory";
import SubmissionProject from "../../entities/submission-project/submission-project";

describe('eslint checker', () => {
    const eslintChecker = new EslintChecker()

    it('should return Not Installed when eslint not exist in package.json', function () {
        const project = createProject('./test/student-project/sample-project')

        expect(eslintChecker.check(project)).toStrictEqual({isSuccess:false, code:'ESLINT_NOT_INSTALLED'})
    });

    it('should return config error if eslint not configure properly', function () {
        const project = createProject('./test/student-project/project-with-bad-configure-eslint')

        const checkResult = eslintChecker.check(project)
        expect(checkResult.isSuccess).toStrictEqual(false)
        expect(checkResult.reason).toContain('ESLint couldn\'t find the config "air-bnd" to extend from. Please check that the name of the config is correct.')
    });

    it('should return the project not linting properly', function () {
        const project = createProject('./test/student-project/project-with-bad-code-style')

        const checkResult = eslintChecker.check(project)
        expect(checkResult.isSuccess).toStrictEqual(false)
        expect(checkResult.reason).toContain('problems')
    });

    it('should return success if no error happen', function () {
        const project = createProject('./test/student-project/passed-project')

        const checkResult = eslintChecker.check(project)
        expect(checkResult.isSuccess).toStrictEqual(true)
    });

    function createProject(submissionPath: string): SubmissionProject {
        const submissionProjectFactory = new SubmissionProjectFactory(submissionPath)
        return submissionProjectFactory.create()
    }
})