import ChecklistIdResolver from "./checklist-id-resolver";
import getSubmissionRequirement from "../../config/submission-requirement";

describe('checklist id resolver test', ()=> {
    const checklistIdResolver = new ChecklistIdResolver()

    it('should do nothing when config file is not found', function () {
        const submissionRequirement = getSubmissionRequirement()
        checklistIdResolver.resolve('/home/user/project', submissionRequirement)

        expect(submissionRequirement).toStrictEqual(getSubmissionRequirement())
    });

    it('should do nothing when json config file is not valid', function () {
        const submissionRequirement = getSubmissionRequirement()
        checklistIdResolver.resolve('./test/student-project/project-with-invalid-json-autoreview-config', submissionRequirement)

        expect(submissionRequirement).toStrictEqual(getSubmissionRequirement())
    });

    it('should update checklist id when config is exist', function () {
        const submissionRequirement = getSubmissionRequirement()
        checklistIdResolver.resolve('./test/student-project/project-with-correct-autoreview-config', submissionRequirement)

        const expectedSubmissionRequirement = getSubmissionRequirement()
        expectedSubmissionRequirement.PROJECT_HAVE_CORRECT_RUNNER_SCRIPT.checklistId = null
        expectedSubmissionRequirement.PROJECT_HAVE_CORRECT_PORT.checklistId = null
        expectedSubmissionRequirement.API_CAN_INSERT_BOOK.checklistId = 41620
        expectedSubmissionRequirement.API_CAN_GET_ALL_BOOK.checklistId = 41625
        expectedSubmissionRequirement.API_CAN_GET_DETAIL_BOOK.checklistId = 41630
        expectedSubmissionRequirement.API_CAN_UPDATE_BOOK.checklistId = 41635
        expectedSubmissionRequirement.API_CAN_DELETE_BOOK.checklistId = 41640

        expect(submissionRequirement).toStrictEqual(expectedSubmissionRequirement)
    });
})