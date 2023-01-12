const submissionRequirements = {
    PROJECT_HAVE_PORT_5000: {
        status: false,
    },
    API_CAN_INSERT_BOOK: {
        status: false,
        postmanTestName: 'API dapat menyimpan buku',
        postmanTestRequirements: [
            '[Mandatory] Add Book With Complete Data',
            '[Mandatory] Add Book Without Name',
            '[Mandatory] Add Book with Page Read More Than Page Count'
        ]
    },
    API_CAN_GET_ALL_BOOK: {
        status: false,
        postmanTestName: 'API dapat menampilkan seluruh buku',
        postmanTestRequirements: [
            '[Mandatory] Get All Books',
        ]
    },
    API_CAN_GET_DETAIL_BOOK: {
        status: false,
        postmanTestName: 'API dapat menampilkan detail buku',
        postmanTestRequirements:
            [
                '[Mandatory] Get Detail Books With Correct Id',
                '[Mandatory] Get Detail Books With Invalid Id'
            ]
    },
    API_CAN_UPDATE_BOOK: {
        status: false,
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
        postmanTestName: 'API dapat menghapus buku',
        postmanTestRequirements:
            [
                '[Mandatory] Delete Book with Correct Id',
                '[Mandatory] Delete Book with Invalid Id'
            ]
    }
}

export default submissionRequirements
