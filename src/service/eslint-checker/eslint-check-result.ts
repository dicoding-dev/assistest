interface EslintCheckResult {
    isSuccess: boolean;
    reason?: string;
    code?: string;
}

export default EslintCheckResult