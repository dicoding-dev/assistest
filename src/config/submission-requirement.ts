const submissionRequirements = {
    PROJECT_HAVE_CORRECT_PORT: {
        status: false,
        possibleChecklistId: [
            43220, //aws
            42180,
            42865 //google cloud
        ],
        checklistId: null,
    },
    PROJECT_HAVE_CORRECT_RUNNER_SCRIPT: {
        status: false,
        possibleChecklistId: [
            43225, //aws
            42185,
            42870  //google cloud
        ],
        checklistId: null,
    },
    API_CAN_INSERT_BOOK: {
        status: false,
        possibleChecklistId: [
            43195, //aws
            42155,
            42840, //google cloud
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
            43200, //aws
            42160,
            42845, //google cloud
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
            43205, //aws
            42165,
            42850, //google cloud
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
            43210, //aws
            42170,
            42855 //google cloud
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
            43215, //aws
            42175,
            42860 //google cloud
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
