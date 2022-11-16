import * as fs from "fs";
import * as path from "path";

class PackageJsonFinderService {
    private readonly submissionPath: string;

    constructor(submissionPath: string) {
        this.submissionPath = submissionPath;
    }

    getPackageJsonDirectory(): string | null {
        if (!fs.existsSync(this.submissionPath)) {
            return null
        }

        const files = this.getFilesRecursively()
        const packageJsonPath = files.find((file) => path.basename(file) === 'package.json')
        if (!packageJsonPath) {
            return null
        }
        return path.dirname(packageJsonPath)
    }


    private getFilesRecursively() {
        const files = []
        getFiles(this.submissionPath)

        function getFiles(directory) {
            fs.readdirSync(directory).forEach(file => {
                const absolute = path.join(directory, file);
                if (fs.statSync(absolute).isDirectory() && !absolute.split(path.sep).includes('node_modules')) {
                    getFiles(absolute);
                } else {
                    files.push(absolute);
                }
            });
        }

        return files
    }
}

export default PackageJsonFinderService