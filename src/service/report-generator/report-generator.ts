import ReviewResult, {ReviewResultStatus} from "../../entities/review-result/course-submission-review/review-result";
import {writeFileSync} from "fs";
import * as fs from "fs";
import ReviewTemplateGenerator from "../review-template-generator/review-template-generator";


class ReportGenerator {
    private readonly reportPath: string;
    private result = []

    constructor(reportPath: string) {
        this.reportPath = reportPath;
    }

    generate(reviewResult: ReviewResult, submissionPath: string) {
        const isApproved = reviewResult.status === ReviewResultStatus.Approve
        const reviewTemplateGenerator = new ReviewTemplateGenerator(submissionPath)

        const completedChecklist = Object.keys(reviewResult.checklist)
            .filter(checklistName => reviewResult.checklist[checklistName].status === true && reviewResult.checklist[checklistName].checklistId)
            .map(checklistName => reviewResult.checklist[checklistName].checklistId)

        const summary = {
            review_id: Date.now(),
            is_approved: isApproved,
            rating: reviewResult.rating,
            message: reviewTemplateGenerator.getReviewMessageWithTemplate(reviewResult.message, isApproved),
            submission_path: submissionPath,
            checklist: reviewResult.checklist,
            completed_checklist: completedChecklist
        };

        this.result.push(summary);
        fs.mkdirSync(this.reportPath, {recursive: true});

        writeFileSync(`${this.reportPath}/report.json`, JSON.stringify(this.result))
    }
}

export default ReportGenerator