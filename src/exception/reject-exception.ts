import RejectionType from "../entities/review-result/rejection-type";
import FailureTest from "../service/postman-runner/failure-test";
import InvariantException from "./invariant-exception";
import ResultTestFailure from "../service/postman-runner/failure-test";

class RejectException extends Error{


    private readonly _rejectionType: RejectionType;
    private readonly _failurePostmanTest: Array<FailureTest>;
    private readonly _error?: InvariantException;

    constructor(rejectionType: RejectionType, failurePostmanTest: Array<FailureTest>, error?: InvariantException) {
        super();
        this._rejectionType = rejectionType;
        this._failurePostmanTest = failurePostmanTest;
        this._error = error;
    }

    get error(): InvariantException {
        return this._error;
    }

    get failurePostmanTest(): Array<ResultTestFailure> {
        return this._failurePostmanTest;
    }
    get rejectionType(): RejectionType {
        return this._rejectionType;
    }
}

export default RejectException