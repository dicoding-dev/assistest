import SubmissionErrorException from "./submission-error-exception";
import PostReviewMethod from "../entities/review-result/post-review-method";

class ProjectErrorException extends SubmissionErrorException {
    constructor(message: string, additionalMessage?: string, serverErrorLog?: string[], postReviewMethod?: PostReviewMethod) {
        super(message, postReviewMethod)
        this.message = message;
        this.additionalMessage = additionalMessage;
        this.serverErrorLog = serverErrorLog;
        this.failurePostmanTest = []
    }
}

export default ProjectErrorException
