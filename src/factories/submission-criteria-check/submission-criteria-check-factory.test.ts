import SubmissionCriteriaCheckFactory from "./submission-criteria-check-factory";
import ResultTestFailure from "../../service/postman-runner/failure-test";
import getSubmissionRequirements from "../../config/submission-requirement";


describe('mandatory criteria test', () => {
    const submissionRequirements = getSubmissionRequirements()
    submissionRequirements.PROJECT_HAVE_CORRECT_RUNNER_SCRIPT.status = true
    submissionRequirements.PROJECT_HAVE_CORRECT_PORT.status = true
    const submissionCriteriaCheckFactory = new SubmissionCriteriaCheckFactory(submissionRequirements)

    it('should grouping failed test by criteria and return approval false', function () {
        const failurePostmanTest: Array<ResultTestFailure> = [
            {
                name: '[Mandatory] Add Book With Complete Data',
                tests: [{
                    test: 'Add book with correct id',
                    message: 'Failed to add book, 404',
                }, {
                    test: 'Status code should 201',
                    message: 'Failed to add book, 404',
                }]
            }, {
                name: '[Mandatory] Get All Books',
                tests: [{
                    test: 'Status code should 200',
                    message: 'Failed to add book, 404',
                }]
            }
        ]

        const expectedReviewChecklistResult = getSubmissionRequirements()
        expectedReviewChecklistResult.PROJECT_HAVE_CORRECT_PORT.status = true
        expectedReviewChecklistResult.PROJECT_HAVE_CORRECT_RUNNER_SCRIPT.status = true
        expectedReviewChecklistResult.API_CAN_DELETE_BOOK.status = true
        expectedReviewChecklistResult.API_CAN_GET_DETAIL_BOOK.status = true
        expectedReviewChecklistResult.API_CAN_UPDATE_BOOK.status = true
        expectedReviewChecklistResult.API_CAN_INSERT_BOOK.reason = [
            {
                "name": "[Mandatory] Add Book With Complete Data",
                "tests": [
                    {
                        "message": "Failed to add book, 404",
                        "test": "Add book with correct id",
                    },
                    {
                        "message": "Failed to add book, 404",
                        "test": "Status code should 201",
                    },
                ]
            }]
        expectedReviewChecklistResult.API_CAN_GET_ALL_BOOK.reason = [{
            "name": "[Mandatory] Get All Books",
            "tests": [{
                "message": "Failed to add book, 404",
                "test": "Status code should 200",
            }],
        }]

        const submissionCriteriaCheck = submissionCriteriaCheckFactory.check(failurePostmanTest)

        expect(submissionCriteriaCheck.approvalStatus).toBeFalsy()
        expect(submissionCriteriaCheck.reviewChecklistResult).toStrictEqual(expectedReviewChecklistResult)
    })

    it('should return approval true', function () {
        const failurePostmanTest: Array<ResultTestFailure> = []

        const submissionCriteriaCheck = submissionCriteriaCheckFactory.check(failurePostmanTest)
        expect(submissionCriteriaCheck.approvalStatus).toBeTruthy()

        const expectedReviewChecklistResult = getSubmissionRequirements()
        expectedReviewChecklistResult.API_CAN_INSERT_BOOK.status = true
        expectedReviewChecklistResult.API_CAN_GET_ALL_BOOK.status = true
        expectedReviewChecklistResult.API_CAN_GET_DETAIL_BOOK.status = true
        expectedReviewChecklistResult.API_CAN_UPDATE_BOOK.status = true
        expectedReviewChecklistResult.API_CAN_DELETE_BOOK.status = true
        expectedReviewChecklistResult.PROJECT_HAVE_CORRECT_PORT.status = true
        expectedReviewChecklistResult.PROJECT_HAVE_CORRECT_RUNNER_SCRIPT.status = true

        expect(submissionCriteriaCheck.reviewChecklistResult).toStrictEqual(expectedReviewChecklistResult)
    })

    it('should return approval false and all criteria is not passed when failed postman test not exist', function () {
        const submissionCriteriaCheck = submissionCriteriaCheckFactory.check()
        expect(submissionCriteriaCheck.approvalStatus).toBeFalsy()
        const expectedReviewChecklistResult = getSubmissionRequirements()
        expectedReviewChecklistResult.PROJECT_HAVE_CORRECT_RUNNER_SCRIPT.status = true
        expectedReviewChecklistResult.PROJECT_HAVE_CORRECT_PORT.status = true

        expect(submissionCriteriaCheck.reviewChecklistResult).toStrictEqual(expectedReviewChecklistResult)
        expect(submissionCriteriaCheck.failurePostmanTest).toBeNull()
    });
})