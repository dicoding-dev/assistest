# Assistest

Aplikasi untuk menjalankan automation review untuk kelas backend pemula

## Prerequisite

1. Nodejs minimal versi 14
2. Submission backend yang sudah diextract. Pastikan folder submission memiliki format `id_submission nama_siswa`,
   contohnya `00001 abdul`
3. Install dependency menggunakan `npm i` atau `yarn`.
4. Pastikan port 9000 tidak digunakan oleh aplikasi lain.

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
## Menjalankan aplikasi menggunakan Docker
Jika menjalankan aplikasi menggunakan Docker, maka tidak perlu melakukan install dependencies, install akan dilakukan oleh Dockerfile.


Step pertama yang harus dilakukan adalah bulild image, contoh perintah build image adalah seperti berikut
```
docker build -t dicoding/assistest .
```
Lalu gunakan perintah berikut untuk menjalankan aplikasi
```
docker run -it --rm  dicoding/assistest -s <path submission> -r <path review result akan disimpan>
```
Perlu dingat `<path submission>` dan  `<path review result akan disimpan>` perlu berada di dalam container. 
Jika tidak ingin menggunakan path yang ada di container maka bisa gunakan volume mapping. Contoh
``` 
docker run -it --rm \                                                    
-v /home/user/download/:/submission-backend \
dicoding/assistest yarn assistest -s /home/user/download/submission-backend -r /home/user/download/review-result
```

## Hasil Review

Silakan buka file `report.json` di path result yang telah ditentukan di atas.

## Keterangan Argument

| Argument                  | Type    | Description                                                           | Required |
|---------------------------|---------|-----------------------------------------------------------------------|----------|
| `-s` atau `--submissions` | string  | Folder submission                                                     | Required |
| `-r` atau `--result`      | string  | Folder disimpannya file `report.json`                                 | Required |
| `-m` atau `--multiple`    | boolean | Jika `true` maka folder submission harus memiliki kumpulan submission | Optional |


