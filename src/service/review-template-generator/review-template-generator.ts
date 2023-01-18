import {existsSync, readFileSync} from "fs";
import * as templates from '../../config/review-template.json'

export default class ReviewTemplateGenerator {
    private readonly courseId: number = 0;
    private submitterName: string;

    constructor(projectPath: string) {
        const configFilePath = `${projectPath}/autoreview-config.json`
        console.log(configFilePath)
        if (!existsSync(configFilePath)) {
            return
        }

        const configFile = this.getConfigFile(configFilePath)
        if (!configFile) {
            return
        }

        console.log(configFile.course_id)
        this.courseId = parseInt(configFile.course_id)
        this.submitterName = configFile.submitter
    }

    getReviewMessageWithTemplate(message: string, isSubmissionApproved = false) {
        const mainTemplate = templates.find(template => template.courseId === this.courseId)

        if (!mainTemplate) {
            return message
        }

        let template: string
        if (isSubmissionApproved) {
            template = mainTemplate.approvalTemplate
        } else {
            template = mainTemplate.rejectionTemplate
        }

        return template
            .replace('$submitter_name', this.submitterName)
            .replace('$review_message', message)
    }


    private getConfigFile(configFilePath: string) {
        try {
            return JSON.parse(readFileSync(configFilePath).toString())
        } catch (e) {
            return null
        }
    }
}