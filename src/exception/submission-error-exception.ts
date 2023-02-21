import ResultTestFailure from "../service/postman-runner/failure-test";
import PostReviewMethod from "../entities/review-result/post-review-method";

abstract class SubmissionErrorException extends Error{
    message: string
    additionalMessage: string
    serverErrorLog: string[]
    failurePostmanTest: ResultTestFailure[]
    postReviewMethod: PostReviewMethod = PostReviewMethod.Draft

    protected constructor(message: string, postReviewMethod?: PostReviewMethod) {
        super(message);
        if (postReviewMethod){
            this.postReviewMethod = postReviewMethod
        }
    }
}

export default SubmissionErrorException
