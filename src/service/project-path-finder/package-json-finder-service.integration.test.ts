import PackageJsonFinderService from "./package-json-finder-service";

describe('project discovery test', () => {
    const projectPath = new PackageJsonFinderService()

    it('should found package.json when path is in root folder', function () {
        expect(projectPath.getPackageJsonDirectory('./test/student-project/sample-project'))
            .toStrictEqual('test/student-project/sample-project')
    });

    it('should found package.json when path is in sub folder', function () {
        expect(projectPath.getPackageJsonDirectory('./test/student-project/sub-folder-package.json'))
            .toStrictEqual('test/student-project/sub-folder-package.json/subfolder')

    });

    it('should found package.json when path is in second sub folder', function () {
        expect(projectPath.getPackageJsonDirectory('./test/student-project/second-sub-folder-package.json'))
            .toStrictEqual('test/student-project/second-sub-folder-package.json/second-subfolder')

    });

    it('should not found package.json', function () {
        expect(projectPath.getPackageJsonDirectory('./test/student-project/empty-package.json'))
            .toBeNull()
    });

    it('should return error when submission path is not found', function () {
        expect(projectPath.getPackageJsonDirectory('./test/student-project/xxxx')).toBeNull()
    });

    it('project path should not contain node-modules ', function () {
        expect(projectPath.getPackageJsonDirectory('test/student-project/folder-with-node-modules'))
            .toStrictEqual('test/student-project/folder-with-node-modules')
    });
})