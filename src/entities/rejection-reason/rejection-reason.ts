import ReviewChecklistResult from "../review-result/review-checklist-result";

class RejectionReason {
    get reason(): string {
        return this._reason;
    }
    get criteria(): Array<ReviewChecklistResult> {
        return this._criteria;
    }


    private readonly _reason: string;
    private readonly _criteria: Array<ReviewChecklistResult>;
    constructor(reason: string, criteria: Array<ReviewChecklistResult>) {
        this._reason = reason;
        this._criteria = criteria;
    }

}

export default RejectionReason