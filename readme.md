# Assistest
Aplikasi untuk menjalankan automation review untuk kelas backend pemula

## Prerequisite
1. Nodejs minimal versi 14
2. Docker
3. Submission backend yang sudah diextract

## Sebelum menjalankan aplikasi lakukan langkah berikut
1. Build docker image yang tersedia pada file ini. Docker image digunakan untuk menjalanakan submission siswa.
    ```
        docker build -t assistest-runner . 
    ```
2. Install dependency menggunakan `npm i` atau `yarn`.

## Menjalankan aplikasi
- Gunakan perintah `npm run cli path=<path submission>` jika ingin menjalankan aplikasi untuk 1 submission. Contoh
  ```
  npm run cli path=~/downloaded-submissions/0000 folder_submission
  ```
  
- Gunakan perintah `npm run cli path=<path kumpulan submission> mode=multi` jika ingin menjalankan aplikasi untuk lebih dari 1 submission.
  ```
  npm run cli path=~/downloaded-submissions/ mode=multi
  ```
  
## Melihat hasil review
Silakan buka `~/report/report.hml` menggunakan web server seperti live server atau http-server


