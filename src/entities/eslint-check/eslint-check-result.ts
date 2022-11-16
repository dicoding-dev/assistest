class EslintCheckResult {
    private readonly _isSuccess: boolean;
    private readonly _reason?: string;
    private readonly _code?: string;

    constructor(isSuccess: boolean, code?: string, reason?: string) {
        this._isSuccess = isSuccess;
        this._code = code;
        this._reason = reason;
    }

    get isSuccess(): boolean {
        return this._isSuccess;
    }
    get reason(): string {
        return this._reason;
    }
    get code(): string{
        return this._code
    }
}

export default EslintCheckResult