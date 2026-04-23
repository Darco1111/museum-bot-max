[README.md](https://github.com/user-attachments/files/27023816/README.md)
Цифровая витрина малых музеев Ставрополья

Бот для мессенджера MAX, который помогает музеям публиковать информацию, а жителям и гостям края — узнавать о культурном наследии.

 Функционал
- Список музеев – 9 музеев с описанием и адресами
- Афиша событий – актуальные мероприятия на апрель–май 2026
- Карта музеев – ссылка на Яндекс.Карты с метками всех музеев
- Случайный экспонат – команда `/random` показывает экспонат дня
- Викторина – команда `/quiz` задаёт вопрос по экспонатам и проверяет ответ
- Поиск по названию – напишите «Казинка» – получите информацию о музее

 Технологии
- Node.js
- `@maxhub/max-bot-api`
- Vercel (serverless functions)
- Webhook MAX API

Установка и запуск локально
```bash
git clone https://github.com/Darco1111/museum-bot-max.git
cd museum-bot-max
npm install
echo "BOT_TOKEN=f9LHodD0cOJkUQUzFZV421abcLiZ-zfziqV9Vj0PMUf6I844abcou-tl4uHRhd6_GjlyIg-1qMzkI8tbwG2e" > .env
node polling.js
