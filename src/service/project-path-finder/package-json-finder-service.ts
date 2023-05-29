import * as fs from "fs";
import * as path from "path";

class PackageJsonFinderService {
    getPackageJsonDirectory(submissionPath: string): string | null {
        if (!fs.existsSync(submissionPath)) {
            return null
        }

        const files = this.getFilesRecursively(submissionPath)
        const packageJsonPath = files.find((file) => path.basename(file) === 'package.json')
        if (!packageJsonPath) {
            return null
        }
        return path.dirname(packageJsonPath)
    }


    private getFilesRecursively(submissionPath: string) {
        const files = []
        getFiles(submissionPath)

        function getFiles(directory) {
            fs.readdirSync(directory).forEach(file => {
                // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal
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