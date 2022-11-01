import ProjectDiscovery from "../project-discovery";

describe('project discovery test', () => {
    it('should found package.json when path is in root folder', function () {
        expect(() => new ProjectDiscovery('./test/student-project/sample-project')).not.toThrow()
    });

    it('should found package.json when path is in sub folder', function () {
        expect(() => new ProjectDiscovery('./test/student-project/sub-folder-package.json')).not.toThrow()
    });

    it('should found package.json when path is in second sub folder', function () {
        expect(() => new ProjectDiscovery('./test/student-project/second-sub-folder-package.json')).not.toThrow()
    });

    it('should not found package.json', function () {
        expect(() => new ProjectDiscovery('./test/student-project/empty-package.json')).toThrow()
    });
})