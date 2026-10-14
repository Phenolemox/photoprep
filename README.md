# Photoprep: check your selfies before an AI photoshoot

**Your photos never leave your device:** everything is checked right in the browser, with no sign-up and no server. [Open Photoprep](https://phenolemox.github.io/photoprep/). The interface is in English and Russian and follows your browser language; add `?lang=en` or `?lang=ru` to the address to switch.

Before you pay a bot for an AI photoshoot, drop your photos here. The page finds the face and crops the shot (1:1 or 4:5), checks sharpness and lighting, says “Good” or “Replace” with a tip on what to reshoot, and suggests which 10 photos to prepare.

**Limitations:** thresholds were tuned on 5 NASA portraits with artificial defects, and blur was tested on only 3 real blurry photos. A portrait in regular glasses or a very tight close-up may get “no face found”, and a normal photo on a dark background may get “too dark”. Masks and filters are not detected, and iOS Safari has not been tested. Found a bug or have feedback? [Leave feedback](https://github.com/Phenolemox/photoprep/issues/new?template=feedback.yml) (opens GitHub, account required).

---

# Проверьте фото до загрузки в нейрофотосессию

**Фото не покидает ваше устройство:** всё проверяется прямо в браузере, без регистрации и без сервера.

![Пример: снимки NASA, вердикты «Годится / Заменить»](screenshot.png)

*На скриншоте «Модель готова (0.2 с)» снято с локальной копии; на медленной сети модель грузится до ~25 с.*

Перед тем как платить боту за нейрофотосессию, загрузите сюда свои снимки. Страница:
- найдёт лицо и обрежет кадр (1:1 или 4:5);
- проверит резкость и свет;
- скажет «Годится» или «Заменить» и что именно переснять;
- подскажет, какие 10 фото подготовить.

**Ограничения:** пороги подобраны на 5 портретах NASA с искусственными дефектами, размытие проверено всего на 3 реальных смазанных фото; портрет в обычных очках или очень крупный план может получить «лицо не найдено»; нормальное фото на тёмном фоне может получить «темно»; маски и фильтры не определяются; iOS Safari не проверен. Нашли ошибку или хотите оставить отзыв — [форма отзыва](https://github.com/Phenolemox/photoprep/issues/new?template=feedback.yml) (откроется GitHub, нужен аккаунт).

Темы репозитория: `ai-photoshoot`, `face-detection`, `privacy`, `browser-only`, `photo-checker`.

---
## Для разработчиков

Одна страница: выбрать фото → для каждого поиск лица, обрезка по рамке (1:1 или 4:5), резкость, свет, вердикт «Годится / Заменить» с советом, скачивание обрезки. Всё в браузере, фото не отправляются.

Запуск локально: `python3 -m http.server -d artifacts/photoprep/v2 8000` → http://localhost:8000/ (нужен http, не file://, из-за wasm/ES-модулей).
Тексты интерфейса: русские — в `strings.js` (источник: copy_LIRA.md), английские — в `strings_en.js` (те же ключи; недостающий ключ берётся из русского). Язык: `?lang=ru|en`, иначе первый язык браузера (ru/uk/be/kk → русский, прочие → английский).
Ссылка «Оставить отзыв» ведёт на форму https://github.com/Phenolemox/photoprep/issues/new?template=feedback.yml (шаблон `.github/ISSUE_TEMPLATE/feedback.yml`; репозиторий опубликован 13.10.2026, Issues включены).
Удаление фона в v0 не сделано (см. MESSAGE.txt).
