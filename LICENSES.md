# Лицензии и источники (photoprep v0)

| Файл | Источник | Лицензия | sha256 |
|---|---|---|---|
| vendor/vision_bundle.mjs | npm `@mediapipe/tasks-vision@1.1.0` (`npm pack`, 13.10.2026); удалена строка sourceMappingURL | Apache-2.0 (package.json) | 9ad3b72f3377741d1c3492c9125dbfef2771dfdee48d4a8ba7fe0928133aba68 |
| vendor/wasm/vision_wasm_internal.js | там же | Apache-2.0 | 7c652617b5bef832f42878ce8c5f752b0724bca6054e4bc1013a37d4b1949723 |
| vendor/wasm/vision_wasm_internal.wasm | там же | Apache-2.0 | 782eda3ec1f414fdb4f1d66a8b59093eb4d5ab437e06117796abf05962d68eef |
| models/blaze_face_full_range.tflite | https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_full_range/float16/1/blaze_face_full_range.tflite | Apache-2.0 (MediaPipe models; model card BlazeFace) | 3698b18f063835bc609069ef052228fbe86d9c9a6dc8dcb7c7c2d69aed2b181b |

Полный текст Apache-2.0 лежит рядом: `LICENSE-APACHE-2.0.txt` (копия официального текста, https://www.apache.org/licenses/LICENSE-2.0). Он покрывает vendored MediaPipe (`vendor/vision_bundle.mjs`, `vendor/wasm/*`) и модель BlazeFace (`models/blaze_face_full_range.tflite`).

## Тестовые изображения (testset/base, производные — testset/*.jpg)
| Файл | Источник | Лицензия |
|---|---|---|
| collins.jpg | `skimage.data.astronaut()` (Eileen Collins, NASA) | Public domain (NASA) |
| armstrong.jpg | https://commons.wikimedia.org/wiki/File:Neil_Armstrong_pose.jpg (NASA) | Public domain |
| ride.jpg | https://commons.wikimedia.org/wiki/File:Sally_Ride_(1984).jpg (NASA, images.nasa.gov) | Public domain |
| jemison.jpg | https://commons.wikimedia.org/wiki/File:Mae_Carol_Jemison.jpg (NASA) | Public domain |
| aldrin.jpg | https://commons.wikimedia.org/wiki/File:Buzz_Aldrin.jpg (NASA) | Public domain |
| noface_coffee / noface_cat / noface_rocket | `skimage.data` coffee, chelsea, rocket | CC0 / CC0 / Public domain (NASA) |
| noface_gradient | синтетика | — |
Лица — только официальные портреты NASA в общественном достоянии; ничьих частных фото нет.
