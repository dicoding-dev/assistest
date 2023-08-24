import SubmissionCriteriaCheckFactory from "./submission-criteria-check-factory";
import ResultTestFailure from "../../service/postman-runner/failure-test";
import getSubmissionRequirements from "../../config/submission-requirement";


describe('mandatory criteria test', () => {
    const submissionRequirements = getSubmissionRequirements()
    submissionRequirements.project_have_correct_runner_script.status = true
    submissionRequirements.project_have_correct_port.status = true
    const submissionCriteriaCheckFactory = new SubmissionCriteriaCheckFactory()

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
        expectedReviewChecklistResult.project_have_correct_port.status = true
        expectedReviewChecklistResult.project_have_correct_runner_script.status = true
        expectedReviewChecklistResult.api_can_delete_book.status = true
        expectedReviewChecklistResult.api_can_get_detail_book.status = true
        expectedReviewChecklistResult.api_can_update_book.status = true
        expectedReviewChecklistResult.api_can_insert_book.reason = [
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
        expectedReviewChecklistResult.api_can_get_all_book.reason = [{
            "name": "[Mandatory] Get All Books",
            "tests": [{
                "message": "Failed to add book, 404",
                "test": "Status code should 200",
            }],
        }]

        const submissionCriteriaCheck = submissionCriteriaCheckFactory.check(submissionRequirements, failurePostmanTest)

        expect(submissionCriteriaCheck.approvalStatus).toBeFalsy()
        expect(submissionCriteriaCheck.reviewChecklistResult).toStrictEqual(expectedReviewChecklistResult)
    })

    it('should return approval true', function () {
        const failurePostmanTest: Array<ResultTestFailure> = []

        const submissionCriteriaCheck = submissionCriteriaCheckFactory.check(submissionRequirements, failurePostmanTest)
        expect(submissionCriteriaCheck.approvalStatus).toBeTruthy()

        const expectedReviewChecklistResult = getSubmissionRequirements()
        expectedReviewChecklistResult.api_can_insert_book.status = true
        expectedReviewChecklistResult.api_can_get_all_book.status = true
        expectedReviewChecklistResult.api_can_get_detail_book.status = true
        expectedReviewChecklistResult.api_can_update_book.status = true
        expectedReviewChecklistResult.api_can_delete_book.status = true
        expectedReviewChecklistResult.project_have_correct_port.status = true
        expectedReviewChecklistResult.project_have_correct_runner_script.status = true

        expect(submissionCriteriaCheck.reviewChecklistResult).toStrictEqual(expectedReviewChecklistResult)
    })

    it('should return approval false and all criteria is not passed when failed postman test not exist', function () {
        const submissionCriteriaCheck = submissionCriteriaCheckFactory.check(submissionRequirements)
        expect(submissionCriteriaCheck.approvalStatus).toBeFalsy()
        const expectedReviewChecklistResult = getSubmissionRequirements()
        expectedReviewChecklistResult.project_have_correct_runner_script.status = true
        expectedReviewChecklistResult.project_have_correct_port.status = true

        expect(submissionCriteriaCheck.reviewChecklistResult).toStrictEqual(expectedReviewChecklistResult)
        expect(submissionCriteriaCheck.failurePostmanTest).toBeNull()
    });
})
