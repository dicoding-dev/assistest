const submissionRequirements = {
    PROJECT_HAVE_CORRECT_PORT: {
        status: false,
        possibleChecklistId: [
            47395, //aws 261
            42180, //cloudeka 510
            45840 //google cloud 342
        ],
        checklistId: null,
    },
    PROJECT_HAVE_CORRECT_RUNNER_SCRIPT: {
        status: false,
        possibleChecklistId: [
            47400, //aws 261
            42185, //cloudeka 510
            45845  //google cloud 342
        ],
        checklistId: null,
    },
    API_CAN_INSERT_BOOK: {
        status: false,
        possibleChecklistId: [
            47370, //aws 261
            42155, //cloudeka 510
            45815, //google cloud 342
        ],
        checklistId: null,
        postmanTestName: 'API dapat menyimpan buku',
        reason: [],
        postmanTestRequirements: [
            '[Mandatory] Add Book With Complete Data',
            '[Mandatory] Add Book Without Name',
            '[Mandatory] Add Book with Page Read More Than Page Count'
        ]
    },
    API_CAN_GET_ALL_BOOK: {
        status: false,
        reason: [],
        possibleChecklistId: [
            47375, //aws 261
            42160, //cloudeka 510
            45820, //google cloud 342
        ],
        checklistId: null,
        postmanTestName: 'API dapat menampilkan seluruh buku',
        postmanTestRequirements: [
            '[Mandatory] Get All Books',
        ]
    },
    API_CAN_GET_DETAIL_BOOK: {
        status: false,
        reason: [],
        possibleChecklistId: [
            47380, //aws 261
            42165, //cloudeka 510
            45825, //google cloud 342
        ],
        checklistId: null,
        postmanTestName: 'API dapat menampilkan detail buku',
        postmanTestRequirements:
            [
                '[Mandatory] Get Detail Books With Correct Id',
                '[Mandatory] Get Detail Books With Invalid Id'
            ]
    },
    API_CAN_UPDATE_BOOK: {
        status: false,
        reason: [],
        possibleChecklistId: [
            47385, //aws 261
            42170, //cloudeka 510
            45830 //google cloud 342
        ],
        checklistId: null,
        postmanTestName: 'API dapat mengubah data buku',
        postmanTestRequirements: [
            '[Mandatory] Update Book With Complete Data',
            '[Mandatory] Update Book Without Name',
            '[Mandatory] Update Book With Page Read More Than Page Count',
            '[Mandatory] Update Book with Invalid Id'
        ]
    },
    API_CAN_DELETE_BOOK: {
        status: false,
        reason: [],
        possibleChecklistId: [
            47390, //aws 261
            42175, //cloudeka 510
            45835 //google cloud 342
        ],
        checklistId: null,
        postmanTestName: 'API dapat menghapus buku',
        postmanTestRequirements:
            [
                '[Mandatory] Delete Book with Correct Id',
                '[Mandatory] Delete Book with Invalid Id'
            ]
    }
}

const getSubmissionRequirement = (): typeof submissionRequirements => {
    return JSON.parse(JSON.stringify(submissionRequirements))
}
export default getSubmissionRequirement
export type SubmissionRequirement = typeof submissionRequirements
