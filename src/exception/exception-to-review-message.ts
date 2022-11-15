const exceptionToReviewMessage = {
    'PATH_NOT_CONTAIN_PACKAGE_JSON': 'kami tidak bisa menemukan file pacakge.json pada submission yang kamu kirimkan, perlu diingat pada umumnya aplikasi node js memiliki file package.json untuk menyimpan konfigurasi filenya.',
    'PACKAGE_JSON_NOT_CONTAIN_SCRIPT_PROPERTY': 'file package.json yang kamu buat masih belum memiliki properti "script". Properti script ini digunakan sebagai shortcut untuk menjalankan command. Silakan sesuaikan isi script dengan kriteria submission ya',
    'RUNNER_SCRIPT_NOT_FOUND': 'sepertinya kamu lupa memasukkan command untuk menjalankan project ke dalam properti "script" pada file package.json. Silakan ditambahkan terlebih dahulu yaa.',
    'CANNOT_PARSE_PACKAGE_JSON': 'sepertinya file pacakge.json yang kamu buat belum bisa terformat dengan baik. Silakan diperbaiki yaa.',
    'ESLINT_NOT_INSTALLED': 'Aplikasi yang kamu buat sudah berjalan dengan baik. Tetapi kode yang dituliskan masih ada yang bisa ditingkatkan. Sebaiknya gunakan salah satu style guide yang ada pada eslint agar kode yang kamu buat bisa semakin konsisten. Tingkatkan aplikasinya untuk latihan yaa. Semagatt!!',
    'ESLINT_ERROR' : 'Masih terdapat error ketika eslint dijalankan dengan perintah npx eslint ./src. Sebaiknya diperbaiki yaa, pastikan tidak ada warning atau error pada kode yang kamu buat.',
    'SEVER_FAILED_TO_START': '',
    'PORT_NOT_MEET_REQUIREMENT': 'port yang kamu gunakan untuk menjalankan aplikasi masih belum sesuai dengan kriteria submission, silakan dicek kembali kriterianya yaa.',
    'COMMAND_NOT_FOUND': 'command yang kamu masukkan tidak ditemukan, pastikan kamu sudah menginstallnya atau pastikan command yang kamu masukkan sudah benar dan tidak terjadi typo.',
    'MODULE_NOT_FOUND': 'sepertinya ada file yang tidak terimport dengan baik, pastikan path yang kamu gunakan sudah benar atau pastikan tidak ada typo pada path yang kamu masukkan.'

}

export default exceptionToReviewMessage