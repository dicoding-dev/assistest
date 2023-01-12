import PostmanRequirement from "./postman-requirement";

const postmanRequirements: PostmanRequirement[] = [
        {
            name: 'API dapat menyimpan buku',
            requirements: [
                '[Mandatory] Add Book With Complete Data',
                '[Mandatory] Add Book Without Name',
                '[Mandatory] Add Book with Page Read More Than Page Count'
            ]
        },
        {
            name: 'API dapat menampilkan seluruh buku',
            requirements: [
                '[Mandatory] Get All Books',
            ]
        },
        {
            name: 'API dapat menampilkan detail buku',
            requirements: [
                '[Mandatory] Get Detail Books With Correct Id',
                '[Mandatory] Get Detail Books With Invalid Id'
            ]
        },
        {
            name: 'API dapat mengubah data buku',
            requirements: [
                '[Mandatory] Update Book With Complete Data',
                '[Mandatory] Update Book Without Name',
                '[Mandatory] Update Book With Page Read More Than Page Count',
                '[Mandatory] Update Book with Invalid Id'
            ]
        },
        {
            name: 'API dapat menghapus buku',
            requirements: [
                '[Mandatory] Delete Book with Correct Id',
                '[Mandatory] Delete Book with Invalid Id'
            ]
        }
    ]

export default postmanRequirements