import {SubmissionRequirement} from "../../config/submission-requirement";
import {existsSync, readFileSync} from "fs";

export default class ChecklistIdResolver {
    resolve(projectPath: string, submissionRequirement: SubmissionRequirement) {
        const configFilePath = `${projectPath}/autoreview-config.json`

        if (!existsSync(configFilePath)) {
            return
        }

        const configFile = this.getConfigFile(configFilePath)
        if (!configFile) {
            return
        }

        const checklistFromConfig = configFile.checklist
        Object.keys(submissionRequirement).forEach(requirementName => {
            const requirement = submissionRequirement[requirementName]
            requirement.checklistId = requirement.possibleChecklistId
                .find(checklistId => checklistFromConfig.includes(checklistId)) ?? null
        })

    }

    private getConfigFile(configFilePath: string) {
        try {
            return JSON.parse(readFileSync(configFilePath).toString())
        } catch (e) {
            return null
        }
    }
}