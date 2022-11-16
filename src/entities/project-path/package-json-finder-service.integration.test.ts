import PackageJsonFinderService from "./package-json-finder-service";

describe('project discovery test', () => {
    it('should found package.json when path is in root folder', function () {
        const projectPath = new PackageJsonFinderService('./test/student-project/sample-project')
        expect(projectPath.getPackageJsonDirectory()).toStrictEqual('test/student-project/sample-project')
    });

    it('should found package.json when path is in sub folder', function () {
        const projectPath = new PackageJsonFinderService('./test/student-project/sub-folder-package.json')
        expect(projectPath.getPackageJsonDirectory()).toStrictEqual('test/student-project/sub-folder-package.json/subfolder')

    });

    it('should found package.json when path is in second sub folder', function () {
        const projectPath = new PackageJsonFinderService('./test/student-project/second-sub-folder-package.json')
        expect(projectPath.getPackageJsonDirectory()).toStrictEqual('test/student-project/second-sub-folder-package.json/second-subfolder')

    });

    it('should not found package.json', function () {
        const projectPath = new PackageJsonFinderService('./test/student-project/empty-package.json')
        expect(projectPath.getPackageJsonDirectory()).toBeNull()
    });

    it('should return error when submission path is not found', function () {
        const projectPath = new PackageJsonFinderService('./test/student-project/xxxx')
        expect(projectPath.getPackageJsonDirectory()).toBeNull()
    });

    it('project path should not contain node-modules ', function () {
        const projectPath = new PackageJsonFinderService('test/student-project/folder-with-node-modules')
        expect(projectPath.getPackageJsonDirectory()).toStrictEqual('test/student-project/folder-with-node-modules')
    });
})