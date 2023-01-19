import {SubmissionRequirement} from "../../config/submission-requirement";
import {existsSync, readFileSync} from "fs";

export default class ReviewResultAdjustment {
    private configFile: never | null;

    adjust(projectPath: string, submissionRequirement: SubmissionRequirement) {
        const configFilePath = `${projectPath}/autoreview-config.json`
        this.configFile = this.getConfigFile(configFilePath)
        if (this.configFile){
            this.adjustChecklistIds(this.configFile, submissionRequirement)
        }
    }

    private adjustChecklistIds(configFile, submissionRequirement: SubmissionRequirement) {
        Object.keys(submissionRequirement).forEach(requirementName => {
            const requirement = submissionRequirement[requirementName]
            requirement.checklistId = requirement.possibleChecklistId
                .find(checklistId =>  configFile.checklist.includes(checklistId)) ?? null
        })
    }

    private getConfigFile(configFilePath: string): never | null {
        if (!existsSync(configFilePath)) {
            return null
        }

        try {
            return JSON.parse(readFileSync(configFilePath).toString())
        } catch (e) {
            return null
        }
    }
}