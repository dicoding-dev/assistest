const exceptionToReviewMessage = {
    'PATH_NOT_CONTAIN_PACKAGE_JSON': 'kami tidak bisa menemukan file pacakge.json pada submission yang kamu kirimkan, perlu diingat pada umumnya aplikasi node js memiliki file package.json untuk menyimpan konfigurasi filenya.',
    'PACKAGE_JSON_NOT_CONTAIN_SCRIPT_PROPERTY': 'file package.json yang kamu buat masih belum memiliki properti "script". Properti script ini digunakan sebagai shortcut untuk menjalankan command. Silakan sesuaikan isi script dengan kriteria submission ya',
    'RUNNER_SCRIPT_NOT_FOUND': 'sepertinya kamu lupa memasukkan command untuk menjalankan project ke dalam properti "script" pada file package.json. Silakan ditambahkan terlebih dahulu yaa.',
    'CANNOT_PARSE_PACKAGE_JSON': 'sepertinya file pacakge.json yang kamu buat belum bisa terformat dengan baik. Silakan diperbaiki yaa.'
}

export default exceptionToReviewMessage