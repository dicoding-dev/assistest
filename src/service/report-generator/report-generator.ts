import ReviewResult, {ReviewResultStatus} from "../../entities/review-result/course-submission-review/review-result";
import {writeFileSync} from "fs";


class ReportGenerator {
    result = []
     generate(reviewResult: ReviewResult, submission: string) {

        const submissionId = new RegExp(/(\d+)/g).exec(submission)[1]
        const submissionName = new RegExp(/ +(\w*)/g).exec(submission)[1]
        let status = false
        if (reviewResult.status === ReviewResultStatus.Approve){
            status = true
        }

        const summary = {
            id: submissionId,
            name: submissionName,
            is_success: status,
            rating: reviewResult.rating,
            failure: reviewResult.message,
            url: `https://www.dicoding.com/academysubmissions/${submissionId}`,
        };


        this.result.push(summary);
        writeFileSync(`./report/report.json`, JSON.stringify(this.result))
    }
}

export default ReportGenerator