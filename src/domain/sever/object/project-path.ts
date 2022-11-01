import * as fs from "fs";
import * as path from "path";
import InvariantException from "../../../exception/invariant-exception";

class ProjectPath {
    private readonly value: string;

    constructor(submissionPath: string) {
        this.validate(submissionPath)
        this.value = this.getPackageJsonDirectory(submissionPath)
    }

    toString() {
        return this.value
    }

    private validate(submissionPath){
        if (!fs.existsSync(submissionPath)){
            throw new InvariantException('Submission path is not found')
        }
    }

    private getPackageJsonDirectory(submissionPath): string{
        const files = this.getFilesRecursively(submissionPath)
        const packageJsonPath = files.find((file) => path.basename(file) === 'package.json')
        if (!packageJsonPath) {
            throw new InvariantException('package.json not found')
        }
        return  path.dirname(packageJsonPath)
    }


    private getFilesRecursively(submissionPath) {
        const files = []
        getFiles(submissionPath)

        function getFiles(directory) {
            fs.readdirSync(directory).forEach(file => {
                const absolute = path.join(directory, file);
                if (fs.statSync(absolute).isDirectory()) {
                    getFiles(absolute);
                } else {
                    files.push(absolute);
                }
            });
        }

        return files
    };
}

export default ProjectPath