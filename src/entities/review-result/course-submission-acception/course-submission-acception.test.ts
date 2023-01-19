import CourseSubmissionAcception from "./course-submission-acception";
import EslintCheckResult from "../../../service/eslint-checker/eslint-check-result";
import SubmissionRatingFactory from "../../../factories/submission-rating/submission-rating-factory";
import SubmissionCriteriaCheck from "../submission-criteria-check/submission-criteria-check";
import getSubmissionRequirement from "../../../config/submission-requirement";

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

        const submissionRequirement = getSubmissionRequirement()
        submissionRequirement.API_CAN_INSERT_BOOK.status = true
        submissionRequirement.API_CAN_UPDATE_BOOK.status = true
        submissionRequirement.API_CAN_DELETE_BOOK.status = true
        submissionRequirement.API_CAN_GET_ALL_BOOK.status = true
        submissionRequirement.API_CAN_GET_DETAIL_BOOK.status = true
        submissionRequirement.PROJECT_HAVE_CORRECT_PORT.status = true
        submissionRequirement.PROJECT_HAVE_CORRECT_RUNNER_SCRIPT.status = true

        const courseSubmissionAcception = new CourseSubmissionAcception(<SubmissionCriteriaCheck>{
            reviewChecklistResult: submissionRequirement
        }, submissionRatingGenerator);
        courseSubmissionAcception.accept()

        expect(courseSubmissionAcception.rating).toStrictEqual(3)
        expect(courseSubmissionAcception.messages).not.toBeNull()
        expect(courseSubmissionAcception.reviewChecklistResults).toStrictEqual(submissionRequirement)
    });

    it('should accept submission properly when eslint success', function () {
        const submissionRatingGenerator = <SubmissionRatingFactory>{
            get rating(): number {
                return 5
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

        expect(courseSubmissionAcception.rating).toStrictEqual(5)
        expect(courseSubmissionAcception.messages).toContain('<li>Untuk mengetahui best practices yang ada, terutama penggunaan')
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
                    get reason(): string {
                        return 'Config is not found'
                    }
                }
            }
        }

        const courseSubmissionAcception = new CourseSubmissionAcception(<SubmissionCriteriaCheck>{}, submissionRatingGenerator);
        courseSubmissionAcception.accept()

        expect(courseSubmissionAcception.rating).toStrictEqual(3)
        expect(courseSubmissionAcception.messages).toContain('<pre>')
    });

    it('should ellipsis eslint log when log is long', function () {
        const submissionRatingFactory = <SubmissionRatingFactory>{
            get rating(): number {
                return 4
            },
            get eslintCheckResult(): EslintCheckResult {
                return <EslintCheckResult>{
                    get isSuccess(): boolean {
                        return false
                    },
                    get code(): string {
                        return 'ESLINT_ERROR'
                    },
                    get reason(): string {
                        return "\tMasih terdapat error ketika eslint dijalankan dengan perintah npx eslint ./src. Sebaiknya diperbaiki yaa, pastikan tidak ada warning atau error pada kode yang kamu buat.\n/submission-backend/1669380 yosua_koesnanto/SubmissionBackEnd/src/books.js\n  1:18  error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style\n  2:1   error  Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style\n  3:24  error  Newline required at end of file but not found    eol-last\n\n/submission-backend/1669380 yosua_koesnanto/SubmissionBackEnd/src/handler.js\n    1:20  error  'nanoid' should be listed in the project's dependencies. Run 'npm i -S nanoid' to add it  import/no-extraneous-dependencies\n    1:38  error  Expected linebreaks to be 'LF' but found 'CRLF'                                           linebreak-style\n    2:34  error  Expected linebreaks to be 'LF' but found 'CRLF'                                           linebreak-style\n    3:1   error  Expected linebreaks to be 'LF' but found 'CRLF'                                           linebreak-style\n    4:10  error  Expected linebreaks to be 'LF' but found 'CRLF'                                           linebreak-style\n    5:37  error  Expected linebreaks to be 'LF' but found 'CRLF'                                           linebreak-style\n    6:10  error  Expected linebreaks to be 'LF' but found 'CRLF'                                           linebreak-style\n    7:74  error  Expected linebreaks to be 'LF' but found 'CRLF'                                           linebreak-style\n \n/submission-backend/1669380 yosua_koesnanto/SubmissionBackEnd/src/server.js\n   1:36  error    Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style\n   2:36  error    Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style\n   3:1   error    Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style\n  17:24  error    Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style\n  18:3   warning  Unexpected console statement                     no-console\n  18:58  error    Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style\n  19:3   error    Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style\n  20:1   error    Expected linebreaks to be 'LF' but found 'CRLF'  linebreak-style\n  21:8   error    Newline required at end of file but not found    eol-last\n\n✖ 302 problems (301 errors, 1 warning)\n  300 errors and 0 warnings potentially fixable with the `--fix` option.\n"
                    }
                }
            }
        }
        
        const courseSubmissionAcception = new CourseSubmissionAcception(<SubmissionCriteriaCheck>{}, submissionRatingFactory);
        courseSubmissionAcception.accept()

        expect(courseSubmissionAcception.rating).toStrictEqual(4)
        expect(courseSubmissionAcception.messages).toContain('...')
    });
})