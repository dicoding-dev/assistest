import ReviewResult, {ReviewResultStatus} from "../../entities/review-result/course-submission-review/review-result";
import * as fs from "fs";
import {existsSync, readFileSync, writeFileSync} from "fs";
import * as templates from "../../config/review-template.json";
import raiseDomainEvent from "../../common/domain-event";

class ReportGenerator {
    private readonly reportPath: string;
    private result = []

    constructor(reportPath: string) {
        this.reportPath = reportPath;
    }

    generate(reviewResult: ReviewResult, submissionPath: string) {
        const isApproved = reviewResult.status === ReviewResultStatus.Approve

        const autoReviewConfig = this.getAutoReviewConfig(submissionPath)

        const summary = {
            submission_id: autoReviewConfig?.id,
            review_id: Date.now(),
            is_approved: isApproved,
            rating: reviewResult.rating,
            message: this.getReviewMessageWithTemplate(reviewResult, autoReviewConfig),
            submission_path: submissionPath,
            checklist: reviewResult.checklist,
            checklist_keys: this.getCompletedChecklist(reviewResult),
            is_passed: isApproved,
            is_draft: true,
        };

        this.result.push(summary);
        fs.mkdirSync(this.reportPath, {recursive: true});

        writeFileSync(`${this.reportPath}/report.json`, JSON.stringify(this.result), {
            mode: '0664'
        })
        raiseDomainEvent('report generated')
    }

    private getCompletedChecklist(reviewResult: ReviewResult) {
        return Object.keys(reviewResult.checklist)
            .filter(requirementName => reviewResult.checklist[requirementName].status)

    }

    getReviewMessageWithTemplate(reviewResult: ReviewResult, autoReviewConfig) {
        const mainTemplate = templates.find(template => template.courseId === autoReviewConfig?.course_id)

        if (!mainTemplate) {
            return reviewResult.message
        }

        let template: string
        if (reviewResult.status === ReviewResultStatus.Approve) {
            template = mainTemplate.approvalTemplate
        } else {
            template = mainTemplate.rejectionTemplate
        }

        return template
            .replace('$submitter_name', autoReviewConfig.submitter_name)
            .replace('$review_message', reviewResult.message)
    }


    private getAutoReviewConfig(projectPath: string): any | null {

        const configFilePath = `${projectPath}/auto-review-config.json`
        if (!existsSync(configFilePath)) {
            return
        }
        const getConfigFile = (configFilePath: string) => {
            try {
                return JSON.parse(readFileSync(configFilePath).toString())
            } catch (e) {
                return null
            }
        }

        return getConfigFile(configFilePath)
    }
}

export default ReportGenerator
