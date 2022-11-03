import ReviewResult from "./review-result";
import FailureTest from "../../service/postman-runner/failure-test";
import EslintCheckResult from "../eslint-check/eslint-check-result";

describe('review result test', () => {
    it('should reject submission if failure mandatory test more than zero', function () {
        const failurePostmanTest: Array<FailureTest> = [
            {
                name: '[Mandatory] Sebuah judul test',
                tests: [
                    {
                        test: 'should return error',
                        message: 'response not 400'
                    }
                ]
            }
        ]
        const eslintCheckResult = new EslintCheckResult(false)
        const reviewResult = new ReviewResult(failurePostmanTest, eslintCheckResult)

        expect(reviewResult.approved).toBeFalsy()
        expect(reviewResult.rating).toStrictEqual(0)
    });

    it('should get 3 stars if no optional criteria full filled', function () {
        const failurePostmanTest: Array<FailureTest> = [
            {
                name: '[Optional] Sebuah judul test',
                tests: [
                    {
                        test: 'should return error',
                        message: 'response not 400'
                    }
                ]
            }
        ]
        const eslintCheckResult = new EslintCheckResult(false)
        const reviewResult = new ReviewResult(failurePostmanTest, eslintCheckResult)

        expect(reviewResult.approved).toBeTruthy()
        expect(reviewResult.rating).toStrictEqual(3)
    });


    it('should get 4 stars has one optional criteria', function () {
        const failurePostmanTest: Array<FailureTest> = []
        const eslintCheckResult = new EslintCheckResult(false)
        const reviewResult = new ReviewResult(failurePostmanTest, eslintCheckResult)

        expect(reviewResult.approved).toBeTruthy()
        expect(reviewResult.rating).toStrictEqual(4)
    });

    it('should get 5 stars has all optional criteria full filled', function () {
        const failurePostmanTest: Array<FailureTest> = []
        const eslintCheckResult = new EslintCheckResult(true)
        const reviewResult = new ReviewResult(failurePostmanTest, eslintCheckResult)

        expect(reviewResult.approved).toBeTruthy()
        expect(reviewResult.rating).toStrictEqual(5)
    });
})