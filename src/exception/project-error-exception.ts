import SubmissionErrorException from "./submission-error-excepion";
import PostReviewMethod from "../entities/review-result/post-review-method";

class ProjectErrorException extends SubmissionErrorException {
    constructor(message: string, additionalMessage?: string, serverErrorLog?: string[], postReviewMethod?: PostReviewMethod) {
        super(message)
        this.message = message;
        this.additionalMessage = additionalMessage;
        this.serverErrorLog = serverErrorLog;
        this.failurePostmanTest = []
        this.postReviewMethod = postReviewMethod;
    }
}

export default ProjectErrorException
