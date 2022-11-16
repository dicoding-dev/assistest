import SubmissionProject from "../../entities/submission-project/submission-project";
import EslintCheckResult from "../../entities/eslint-check/eslint-check-result";
import EslintChecker from "./eslint-checker";
import ProjectPath from "../../entities/project-path/project-path";

describe('eslint checker', () => {
    it('should return Not Installed when eslint not exist in package.json', function () {
        const project = createProject('./test/student-project/sample-project')

        const eslintChecker = new EslintChecker(project)
        expect(eslintChecker.check()).toStrictEqual(new EslintCheckResult(false, 'ESLINT_NOT_INSTALLED'))
    });

    it('should return config error if eslint not configure properly', function () {
        const project = createProject('./test/student-project/project-with-bad-configure-eslint')

        const eslintChecker = new EslintChecker(project)
        const checkResult = eslintChecker.check()
        expect(checkResult.isSuccess).toStrictEqual(false)
        expect(checkResult.reason).toContain('ESLint couldn\'t find the config "air-bnd" to extend from. Please check that the name of the config is correct.')
    });

    it('should return the project not linting properly', function () {
        const project = createProject('./test/student-project/project-with-bad-code-style')

        const eslintChecker = new EslintChecker(project)
        const checkResult = eslintChecker.check()
        expect(checkResult.isSuccess).toStrictEqual(false)
        expect(checkResult.reason).toContain('problems')
    });

    function createProject(submissionPath: string) {
        const projectPath = new ProjectPath(submissionPath)
        return new SubmissionProject(projectPath, '', 0, 'test')
    }
})