const submissionRequirements = {
    project_have_correct_port: {
        status: false,
    },
    project_have_correct_runner_script: {
        status: false,
    },
    api_can_insert_book: {
        status: false,
        postmanTestName: 'API dapat menyimpan buku',
        reason: [],
        postmanTestRequirements: [
            '[Mandatory] Add Book With Complete Data',
            '[Mandatory] Add Book Without Name',
            '[Mandatory] Add Book with Page Read More Than Page Count'
        ]
    },
    api_can_get_all_book: {
        status: false,
        reason: [],
        postmanTestName: 'API dapat menampilkan seluruh buku',
        postmanTestRequirements: [
            '[Mandatory] Get All Books',
        ]
    },
    api_can_get_detail_book: {
        status: false,
        reason: [],
        postmanTestName: 'API dapat menampilkan detail buku',
        postmanTestRequirements:
            [
                '[Mandatory] Get Detail Books With Correct Id',
                '[Mandatory] Get Detail Books With Invalid Id'
            ]
    },
    api_can_update_book: {
        status: false,
        reason: [],
        postmanTestName: 'API dapat mengubah data buku',
        postmanTestRequirements: [
            '[Mandatory] Update Book With Complete Data',
            '[Mandatory] Update Book Without Name',
            '[Mandatory] Update Book With Page Read More Than Page Count',
            '[Mandatory] Update Book with Invalid Id'
        ]
    },
    api_can_delete_book: {
        status: false,
        reason: [],
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
