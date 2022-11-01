import * as fs from "fs";
import InvariantException from "../../exception/invariant-exception";
import * as path from "path";


class ProjectDiscovery {

    constructor(path: string) {
        const files = this.getFilesRecursively(`${path}`)
        const packageJsonPath = files.find((file) => file.includes('package.json'))
        if (!packageJsonPath) {
            throw new InvariantException('package.json not found')
        }
    }


    getFilesRecursively(parentPath) {
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

export default ProjectDiscovery