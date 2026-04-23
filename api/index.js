const { Bot } = require('@maxhub/max-bot-api');
const bot = new Bot(process.env.BOT_TOKEN);

// ----- БАЗА ЭКСПОНАТОВ ДЛЯ RANDOM И ВИКТОРИНЫ -----
const exhibits = [
    { name: 'Казачья люлька', museum: 'Школьный музей с. Казинка', description: 'Курительная трубка казака начала XX века.', question: 'Что такое "люлька" у казаков?', answer: 'трубка' },
    { name: 'Письмо с фронта', museum: 'Музей с. Кочубеевское', description: 'Треугольное письмо солдата, 1943 год.', question: 'В каком году написано письмо с фронта?', answer: '1943' },
    { name: 'Казачья шашка', museum: 'Ставропольский краеведческий музей', description: 'Боевая шашка конца XIX века.', question: 'Как называется казачья сабля?', answer: 'шашка' },
    { name: 'Самовар на дровах', museum: 'Музей Русского самовара (ст. Новотроицкая)', description: 'Тульский самовар 1896 года.', question: 'Какой город славится производством самоваров?', answer: 'тула' }
];

let quizSessions = {}; // userId -> { question, answer, museum }

// ----- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ID ПОЛЬЗОВАТЕЛЯ -----
function getUserId(ctx) {
    // Пытаемся получить id из разных возможных мест
    if (ctx.message && ctx.message.from && ctx.message.from.id) return ctx.message.from.id;
    if (ctx.from && ctx.from.id) return ctx.from.id;
    if (ctx.sender && ctx.sender.id) return ctx.sender.id;
    return null;
}

// ----- КОМАНДЫ -----
bot.command('start', async (ctx) => {
    await ctx.reply(`🏛️ Цифровая витрина музеев Ставрополья

Привет! Я знаю всё о малых музеях края.

📋 Доступные команды:
/museums — список музеев
/events — афиша событий
/map — карта музеев
/random — случайный экспонат дня
/quiz — викторина (проверь знания)
/help — помощь

Напиши название музея (например, Казинка), и я расскажу о нём.`);
});

bot.command('help', async (ctx) => {
    await ctx.reply(`Помощь

/museums — все музеи с адресами
/events — ближайшие события (апрель-май 2026)
/map — карта с метками музеев
/random — случайный экспонат из коллекции
/quiz — вопрос на знание экспонатов

Также просто напишите название музея, и я покажу его экспонаты.`);
});

bot.command('museums', async (ctx) => {
    await ctx.reply(`🏛️ Музеи Ставрополья

1. Школьный музей с. Казинка
"Возвращение к истокам" — археология, казачий быт.
📍 ул. Школьная, 1, с. Казинка

2. Музей с. Кочубеевское
Историко-краеведческий музей им. В.И. Фёдорова.
📍 ул. Ленина, 25, с. Кочубеевское

3. Ставропольский краеведческий музей
Более 250 тыс. экспонатов.
📍 ул. Дзержинского, 135, г. Ставрополь

4. Пятигорский краеведческий музей
История КМВ.
📍 пр. Кирова, 41, г. Пятигорск

5. Музей-заповедник М.Ю. Лермонтова
📍 ул. Лермонтова, 4, г. Пятигорск

6. Ессентукский краеведческий музей
📍 ул. Кисловодская, 5, г. Ессентуки

7. Георгиевский историко-краеведческий музей
📍 ул. Ленина, 110, г. Георгиевск

8. Музей Русского самовара
📍 ст. Новотроицкая, ул. Ленина, 44

9. Музей истории сел (с. Большая Рязань)
📍 с. Большая Рязань, ул. Советская, 15`);
});

bot.command('events', async (ctx) => {
    await ctx.reply(`📅 Афиша (апрель–май 2026)

🎉 25 апреля, 18:00 — Ночь музеев
🪶 1 мая, 12:00 — Выставка казачьих ремёсел
🕯️ 9 мая, 10:00 — Экскурсия Память сердца
🎨 15–20 мая — Фестиваль Ставрополье — край традиций`);
});

bot.command('map', async (ctx) => {
    const mapLink = 'https://yandex.ru/maps/?pt=42.921,44.195,pm2rdm~41.928,44.393,pm2rdm~41.969,45.044,pm2rdm~43.037,44.039,pm2rdm~42.958,44.084,pm2rdm&z=9';
    await ctx.reply(`🗺️ Карта музеев: ${mapLink}`);
});

bot.command('random', async (ctx) => {
    const ex = exhibits[Math.floor(Math.random() * exhibits.length)];
    await ctx.reply(`🎲 Случайный экспонат дня

Название: ${ex.name}
Музей: ${ex.museum}
Описание: ${ex.description}`);
});

bot.command('quiz', async (ctx) => {
    const userId = getUserId(ctx);
    if (!userId) {
        await ctx.reply('Не удалось определить пользователя.');
        return;
    }
    const ex = exhibits[Math.floor(Math.random() * exhibits.length)];
    quizSessions[userId] = {
        question: ex.question,
        answer: ex.answer,
        museum: ex.museum
    };
    await ctx.reply(`📚 Викторина!

Вопрос: ${ex.question}

Напишите свой ответ (можно одним словом или числом).`);
});

// ----- ОБРАБОТКА ВСЕХ СООБЩЕНИЙ (включая ответы на викторину) -----
bot.on('message_created', async (ctx) => {
    const userId = getUserId(ctx);
    const text = ctx.message.body.text;

    // Если есть активная сессия викторины для этого пользователя
    if (userId && quizSessions[userId] && !text.startsWith('/')) {
        const session = quizSessions[userId];
        const userAnswer = text.toLowerCase().trim();
        const isCorrect = userAnswer.includes(session.answer);
        if (isCorrect) {
            await ctx.reply(`✅ Правильно! Экспонат находится в музее: ${session.museum}.`);
        } else {
            await ctx.reply(`❌ Неправильно. Правильный ответ: ${session.answer}. Приходите в музей ${session.museum}.`);
        }
        delete quizSessions[userId];
        return;
    }

    // Если сообщение начинается с /, но это не обработанная команда (unknown)
    if (text.startsWith('/')) {
        await ctx.reply(`Неизвестная команда. Напишите /start.`);
        return;
    }

    // Поиск по названию музея
    const lower = text.toLowerCase();
    if (lower.includes('казинка') || lower.includes('школьный')) {
        await ctx.reply(`🏛️ Школьный музей с. Казинка

Экспонаты: казачья люлька, фотографии военных лет.
📍 ул. Школьная, 1. Часы: пн–пт 9:00–17:00.`);
    } else if (lower.includes('кочубеевское')) {
        await ctx.reply(`🏛️ Музей с. Кочубеевское

Экспонаты: письма с фронта, награды, орудия труда казаков.
📍 ул. Ленина, 25. Часы: вт–вс 10:00–18:00.`);
    } else {
        await ctx.reply(`Вы написали: ${text}

Чтобы увидеть главное меню, нажмите /start

Подсказка: отправьте название музея (например, Казинка) или команду /random, /quiz.`);
    }
});

// ----- ЭКСПОРТ ДЛЯ VERCEL -----
module.exports = async (req, res) => {
    try {
        const update = req.body;
        await bot.handleUpdate(update);
        res.status(200).send('OK');
    } catch (err) {
        console.error('Ошибка:', err);
        res.status(500).send('Internal Server Error');
    }
};