import ProjectPath from "./project-path";
import InvariantException from "../../exception/invariant-exception";

describe('project discovery test', () => {
    it('should found package.json when path is in root folder', function () {
        const projectPath = new ProjectPath('./test/student-project/sample-project')
        expect(projectPath.toString()).toStrictEqual('test/student-project/sample-project')
    });

    it('should found package.json when path is in sub folder', function () {
        const projectPath = new ProjectPath('./test/student-project/sub-folder-package.json')
        expect(projectPath.toString()).toStrictEqual('test/student-project/sub-folder-package.json/subfolder')

    });

    it('should found package.json when path is in second sub folder', function () {
        const projectPath = new ProjectPath('./test/student-project/second-sub-folder-package.json')
        expect(projectPath.toString()).toStrictEqual('test/student-project/second-sub-folder-package.json/second-subfolder')

    });

    it('should not found package.json', function () {
        expect(() => new ProjectPath('./test/student-project/empty-package.json')).toThrow()
    });

    it('should return error when submission path is not found', function () {
        expect(() => new ProjectPath('./test/student-project/xxxx')).toThrow(new InvariantException('SUBMISSION_PATH_IS_NOT_FOUND'))
    });

    it('project path should not contain node-modules ', function () {
        const projectPath = new ProjectPath('test/student-project/folder-with-node-modules')
        expect(projectPath.toString()).toStrictEqual('test/student-project/folder-with-node-modules')
    });
})