class EslintCheckResult {
    private readonly _isSuccess: boolean;
    private readonly _reason?: string;

    constructor(isSuccess: boolean, reason?: string) {
        this._isSuccess = isSuccess;
        this._reason = reason;
    }

    get isSuccess(): boolean {
        return this._isSuccess;
    }
    get reason(): string {
        return this._reason;
    }
}

export default EslintCheckResult