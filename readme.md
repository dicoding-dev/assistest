# Assistest

Aplikasi untuk menjalankan automation review untuk kelas backend pemula

## Prerequisite

1. Nodejs minimal versi 14
2. Submission backend yang sudah diextract. Pastikan folder submission memiliki format `id_submission nama_siswa`,
   contohnya `00001 abdul`
3. Install dependency menggunakan `npm i` atau `yarn`.
4. Pastikan port 5000 tidak digunakan oleh aplikasi lain.

## Menjalankan aplikasi menggunakan yarn

- Gunakan perintah `yarn assistest -s <path submission> -r <result path>` jika ingin menjalankan aplikasi untuk 1
  submission. Contoh
  ```
  yarn assistest -s "./downloaded-submissions/0000 folder_submission" -r ./result
  ```

- Gunakan perintah `yarn assistest -s <path kumpulan submissions> -r <result path> -m` jika ingin menjalankan aplikasi
  untuk lebih dari 1 submission.
  ```
  yarn assistest -s ./downloaded-submissions/ -r ./result -m
  ```

## Menjalankan aplikasi menggunakan NPM

- Gunakan perintah `npm run assistest -- -s <path submission> -r <result path>` jika ingin menjalankan aplikasi untuk 1
  submission. Contoh
  ```
  npm run assistest -- -s "./downloaded-submissions/0000 folder_submission" -r ./result
  ```

- Gunakan perintah `npm run assistest -s <path kumpulan submissions> -r <result path> -m` jika ingin menjalankan
  aplikasi untuk lebih dari 1 submission.
  ```
  npm run assistest -- -s ./downloaded-submissions/ -r ./result -m
  ```

## Hasil Review

Silakan buka file `report.json` di path result yang telah ditentukan di atas.

## Keterangan Argument

| Argument                  | Type    | Description                                                           | Required |
|---------------------------|---------|-----------------------------------------------------------------------|----------|
| `-s` atau `--submissions` | string  | Folder submission                                                     | Required |
| `-r` atau `--result`      | string  | Folder disimpannya file `report.json`                                 | Required |
| `-m` atau `--multiple`    | boolean | Jika `true` maka folder submission harus memiliki kumpulan submission | Optional |


