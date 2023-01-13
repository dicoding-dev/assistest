const submissionRequirements = {
    PROJECT_HAVE_CORRECT_PORT: {
        status: false,
        possibleChecklistId: [],
        checklistId: null,
    },
    PROJECT_HAVE_CORRECT_RUNNER_SCRIPT: {
        status: false,
        possibleChecklistId: [],
        checklistId: null,
    },
    API_CAN_INSERT_BOOK: {
        status: false,
        possibleChecklistId: [41620, 41470, 32797],
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
        possibleChecklistId: [41625, 41475, 32802],
        checklistId: null,
        postmanTestName: 'API dapat menampilkan seluruh buku',
        postmanTestRequirements: [
            '[Mandatory] Get All Books',
        ]
    },
    API_CAN_GET_DETAIL_BOOK: {
        status: false,
        reason: [],
        possibleChecklistId: [41630, 41480, 32807],
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
        possibleChecklistId: [41635, 41485, 32812],
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
        possibleChecklistId: [41640, 41490, 32817],
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
