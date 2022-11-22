import CourseSubmissionAcception from "./course-submission-acception";
import EslintCheckResult from "../../../service/eslint-checker/eslint-check-result";
import SubmissionRatingFactory from "../../../factories/submission-rating/submission-rating-factory";
import SubmissionCriteriaCheck from "../submission-criteria-check/submission-criteria-check";

describe('course submission acception test', () => {
    it('should accept submission properly', function () {
        const submissionRatingGenerator = <SubmissionRatingFactory>{
            get rating(): number {
                return 3
            },
            get eslintCheckResult(): EslintCheckResult {
                return <EslintCheckResult>{
                    get isSuccess(): boolean {
                        return false
                    },
                    get code(): string {
                        return 'ESLINT_NOT_INSTALLED'
                    },
                }
            }
        }

        const courseSubmissionAcception = new CourseSubmissionAcception(<SubmissionCriteriaCheck>{}, submissionRatingGenerator);
        courseSubmissionAcception.accept()

        expect(courseSubmissionAcception.rating).toStrictEqual(3)
        expect(courseSubmissionAcception.messages).not.toBeNull()
        expect(courseSubmissionAcception.reviewChecklistResults).toStrictEqual([])
    });

    it('should accept submission properly when eslint success', function () {
        const submissionRatingGenerator = <SubmissionRatingFactory>{
            get rating(): number {
                return 3
            },
            get eslintCheckResult(): EslintCheckResult {
                return <EslintCheckResult>{
                    get isSuccess(): boolean {
                        return true
                    },
                }
            }
        }

        const courseSubmissionAcception = new CourseSubmissionAcception(<SubmissionCriteriaCheck>{}, submissionRatingGenerator);
        courseSubmissionAcception.accept()

        expect(courseSubmissionAcception.rating).toStrictEqual(3)
        expect(courseSubmissionAcception.messages).toStrictEqual('Congrats. ')
    });

    it('should format eslint message when eslint have error log', function () {
        const submissionRatingGenerator = <SubmissionRatingFactory>{
            get rating(): number {
                return 3
            },
            get eslintCheckResult(): EslintCheckResult {
                return <EslintCheckResult>{
                    get isSuccess(): boolean {
                        return false
                    },
                    get code(): string {
                        return 'ESLINT_ERROR'
                    },
                }
            }
        }

        const courseSubmissionAcception = new CourseSubmissionAcception(<SubmissionCriteriaCheck>{}, submissionRatingGenerator);
        courseSubmissionAcception.accept()

        expect(courseSubmissionAcception.rating).toStrictEqual(3)
        expect(courseSubmissionAcception.messages).toContain('<pre>')
    });
})