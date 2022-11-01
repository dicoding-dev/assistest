import * as fs from "fs";
import * as path from "path";
import InvariantException from "../../../exception/invariant-exception";

class ProjectPath {
    private readonly value: string;

    constructor(projectPath: string) {
        const files = this.getFilesRecursively(projectPath)
        const packageJsonPath = files.find((file) => path.basename(file) === 'package.json')
        if (!packageJsonPath) {
            throw new InvariantException('package.json not found')
        }
        this.value = path.dirname(packageJsonPath)
    }

    toString() {
        return this.value
    }


    private getFilesRecursively(parentPath) {
        const files = []
        getFiles(parentPath)

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