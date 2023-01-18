const submissionRequirements = {
    PROJECT_HAVE_CORRECT_PORT: {
        status: false,
        possibleChecklistId: [
            42145,
            42215,
            42180
        ],
        checklistId: null,
    },
    PROJECT_HAVE_CORRECT_RUNNER_SCRIPT: {
        status: false,
        possibleChecklistId: [
            42150,
            42220,
            42185
        ],
        checklistId: null,
    },
    API_CAN_INSERT_BOOK: {
        status: false,
        possibleChecklistId: [
            42120,
            42190,
            42155
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
            42125,
            42195,
            42160
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
            42130,
            42200,
            42165
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
            42135,
            42205,
            42170
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
            42140,
            42210,
            42175
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
