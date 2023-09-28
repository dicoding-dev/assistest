import {execSync} from "child_process";
import SubmissionProject from "../../entities/submission-project/submission-project";
import ServerErrorException from "../../exception/server-error-exception";
import raiseDomainEvent from "../../common/domain-event";
import * as fs from "fs";
import {join} from "path";

class ProjectPreparationService {
    install(submissionProject: SubmissionProject) {
        try {
            const isPackageLockExist = fs.existsSync(join(submissionProject.packageJsonPath, 'package-lock.json'))
            const isYarnLockExist = fs.existsSync(join(submissionProject.packageJsonPath, 'yarn.lock'))

            if (isPackageLockExist) {
                execSync('npm ci', {cwd: submissionProject.packageJsonPath, stdio: 'pipe', encoding:'utf-8'})
                raiseDomainEvent('dependencies installed')
                return
            }

            if (isYarnLockExist) {
                execSync('yarn install --frozen-lockfile', {cwd: submissionProject.packageJsonPath, stdio: 'pipe', encoding:'utf-8'})
                raiseDomainEvent('dependencies installed')
                return
            }

            execSync('npm install', {cwd: submissionProject.packageJsonPath, stdio: 'pipe', encoding:'utf-8'})
            raiseDomainEvent('dependencies installed')
        } catch (e) {
            const errorLog = e.stderr
                .replace(/npm ERR! A complete log of this r.*/gs, '')
                .trim()
            throw new ServerErrorException('FAIL_INSTALLING_PACKAGE', '', [errorLog])
        }
    }
}

export default ProjectPreparationService
