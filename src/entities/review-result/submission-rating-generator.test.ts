import FailureTest from "../../service/postman-runner/failure-test";
import SubmissionRatingGenerator from "./submission-rating-generator";

describe('submission rating generator test', () => {
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
        const eslintCheckResult = {isSuccess: false}
        const reviewResult = new SubmissionRatingGenerator(failurePostmanTest, eslintCheckResult)

        expect(reviewResult.rating).toStrictEqual(3)
    });


    it('should get 4 stars has one optional criteria', function () {
        const failurePostmanTest: Array<FailureTest> = []
        const eslintCheckResult = {isSuccess: false}
        const reviewResult = new SubmissionRatingGenerator(failurePostmanTest, eslintCheckResult)

        expect(reviewResult.rating).toStrictEqual(4)
    });

    it('should get 5 stars has all optional criteria full filled', function () {
        const failurePostmanTest: Array<FailureTest> = []
        const eslintCheckResult = {isSuccess: true}
        const reviewResult = new SubmissionRatingGenerator(failurePostmanTest, eslintCheckResult)

        expect(reviewResult.rating).toStrictEqual(5)
    });
})