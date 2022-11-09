import SubmissionCriteria from "../review-result/submission-criteria";

class RejectionReason {
    get reason(): string {
        return this._reason;
    }
    get criteria(): Array<SubmissionCriteria> {
        return this._criteria;
    }


    private readonly _reason: string;
    private readonly _criteria: Array<SubmissionCriteria>;
    constructor(reason: string, criteria: Array<SubmissionCriteria>) {
        this._reason = reason;
        this._criteria = criteria;
    }

}

export default RejectionReason