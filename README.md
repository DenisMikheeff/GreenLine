## PSA! | ВНИМАНИЕ!

The service has not been tested yet due to unavailability of MAX bot creation functionality.

Сервис пока не тестировался, т.к. в MAX недоступно создание ботов.

---

## Backlog | Бэклог

• User pairing via bots using refcodes | Сведение пользователей внутри ботов через рефкоды

• Chats with multiple users support | Поддержка чатов с несколькими пользователями

• Group chats and channels support | Поддержка групповых чатов и каналов

---

# English (Русский текст ниже)

## What is GreenLine?

GreenLine is a secure, private bridge that connects MAX messenger (Russia) with Telegram, allowing people to communicate across these platforms through an encrypted, one-to-one tunnel system. 

**Key Features:**
- ✅ **Private conversations**: Each MAX user is paired with only one Telegram user
- ✅ **End-to-end isolation**: No cross-talk or message leaking between different pairs
- ✅ **Password-protected admin panel**: Full control over who can communicate
- ✅ **Cloud deployment**: No local setup required, runs entirely in the cloud
- ✅ **Free hosting**: Can be deployed on free cloud platforms like Render

## How It Works

1. **MAX User** sends a message to your MAX bot
2. **Bridge** receives the message and forwards it to the paired Telegram user
3. **Telegram User** receives the message and can reply
4. **Bridge** forwards the reply back to the original MAX user
5. All communication stays private between the paired users only

## Prerequisites

Before you start, you need:
- A Telegram account
- Access to MAX messenger (Russian/Belarusian phone number required)
- A GitHub account (free) OR feel free to use my public repo
- A Render account (free)

## Step-by-Step Deployment Guide

### Step 1: Create Your Bots

#### 1.1 Create Telegram Bot
1. Open Telegram and search for `@BotFather`
2. Send `/start` to BotFather
3. Send `/newbot` and follow the prompts:
   - Choose a name for your bot (e.g., "GreenLine Bridge")
   - Choose a username ending with 'bot' (e.g., "greenlinebridge_bot")
4. **SAVE THE BOT TOKEN** - you'll need this later
5. Optionally, set commands by sending `/setcommands` to BotFather

#### 1.2 Create MAX Bot
1. Open MAX messenger and find `@MasterBot`
2. Send `/create` to MasterBot
3. Follow the prompts:
   - Choose a unique nickname ending with "bot" or "_bot" (minimum 11 characters)
   - Add a display name for your bot
4. **SAVE THE BOT TOKEN** that MasterBot sends you
5. Set your webhook: Send `/set_webhook` to MasterBot (you'll update this later)

### Step 2 (optional): Fork This Repository

1. Click the "Fork" button at the top of this GitHub page
2. This creates your own copy of GreenLine under your GitHub account

### Step 3: Deploy to Render

1. Go to [Render.com](https://render.com) and create a free account
2. Click "New +" and select "Web Service"
3. Connect your GitHub account if prompted (if you did Step 2)
4. Select your forked GreenLine repository (if you did Step 2) OR feel free to use my public repo
5. Configure the service:
   - **Name**: Choose any name (e.g., "greenline-bridge")
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Build Command**: `yarn install` (default)
   - **Start Command**: `node index.js` (default)
6. Click "Create Web Service"

### Step 4: Configure Environment Variables

After your service is created:

1. Go to your Render service dashboard
2. Click on the "Environment" tab
3. Add these three environment variables:

| Key | Value | Description |
|-----|-------|-------------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token from Step 1.1 | Token from BotFather |
| `MAX_BOT_TOKEN` | Your MAX bot token from Step 1.2 | Token from MasterBot |
| `ADMIN_PASSWORD` | Choose a strong password | For admin panel access |

4. Click "Save Changes"
5. Render will automatically redeploy your service

### Step 5: Set Up Webhooks

#### 5.1 Set Telegram Webhook
1. Copy your Render service URL (something like `https://yourapp.onrender.com`)
2. Open this URL in your browser: `https://yourapp.onrender.com/setup-tg-webhook`
3. You should see a JSON response with `"ok": true`

#### 5.2 Set MAX Webhook
1. In MAX, send this command to MasterBot:
   `/set_webhook https://yourapp.onrender.com/max-webhook`
2. Replace `yourapp.onrender.com` with your actual Render URL

### Step 6: Access Admin Panel

1. Open your admin panel: `https://yourapp.onrender.com/admin`
2. Enter the admin password you set in Step 4
3. You'll see the pairing interface

### Step 7: Pair Users

To create a private conversation tunnel:

1. **Get User IDs:**
   - **Telegram User ID**: User can message `@userinfobot` on Telegram to get their ID
   - **MAX User ID**: This appears in your service logs when they first message your MAX bot

2. **Add Pair:**
   - Enter the MAX User ID and Telegram User ID in the admin panel
   - Click "Add Pair"

3. **Test:**
   - MAX user sends a message to your MAX bot
   - Telegram user should receive it
   - Telegram user replies, MAX user should receive it

## Usage Instructions

### For MAX Users
1. Find and start a conversation with your MAX bot
2. Send any message - it will be forwarded to your paired Telegram contact

### For Telegram Users
1. Find and start your Telegram bot (click "Start")
2. You'll receive messages from your paired MAX contact
3. Reply directly in the bot chat - messages go back to MAX

### For Administrators
1. Access the admin panel to manage user pairs
2. Add new pairs by entering user IDs
3. Remove pairs when no longer needed
4. Monitor service health through Render dashboard

## Security Notes

- **Never share your bot tokens publicly**
- **Set a strong admin password**
- **Only pair users you trust**
- **Monitor your admin panel access logs**
- **Keep your repository private if you add sensitive data**

## Troubleshooting

### Service Won't Start
- Check that all three environment variables are set correctly
- Verify bot tokens are valid and complete
- Check Render service logs for specific error messages

### Messages Not Forwarding
- Ensure webhooks are set correctly for both platforms
- Confirm users are properly paired in admin panel
- Check that Telegram users have started the bot
- Verify MAX users have permission to use your bot

### Admin Panel Won't Load
- Confirm admin password is set as environment variable
- Check that `/admin` is added to your service URL
- Verify service is running and healthy

## Limitations

- **Free Render plan**: Service may sleep after 30 minutes of inactivity
- **MAX access**: Requires Russian/Belarusian phone number for bot creation
- **User limits**: No built-in limit, but manage pairs responsibly
- **File sharing**: Current version supports text only

## Cost Information

- **GitHub**: Free for public repositories
- **Render**: Free tier includes 750 hours/month (sufficient for continuous operation)
- **Telegram Bot**: Free
- **MAX Bot**: Free

**Total cost: $0/month** for typical usage on free tiers.

## Legal Disclaimer

**Deployments using this code are solely the responsibility of the deploying party; the author is not responsible for their costs, uptime, or maintenance.**

This software is provided "as is" without warranty. Users are responsible for compliance with local laws and platform terms of service.

## Support

For issues and questions:
1. Check this README first
2. Review Render deployment logs
3. Verify bot tokens and environment variables
4. Check that webhooks are properly configured

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

# Русский

## Что такое GreenLine?

GreenLine — это безопасный, конфиденциальный мост, который соединяет мессенджер MAX (Россия) с Telegram, позволяя людям общаться через эти платформы с помощью зашифрованной системы индивидуальных туннелей.

**Основные возможности:**
- ✅ **Приватные разговоры**: каждый пользователь MAX связан только с одним пользователем Telegram
- ✅ **Полная изоляция**: нет пересечений или утечек сообщений между разными парами
- ✅ **Защищённая паролем админ-панель**: полный контроль над тем, кто может общаться
- ✅ **Облачное развёртывание**: не требует локальной настройки, работает полностью в облаке
- ✅ **Бесплатный хостинг**: можно развернуть на бесплатных облачных платформах вроде Render

## Как это работает

1. **Пользователь MAX** отправляет сообщение вашему MAX-боту
2. **Мост** получает сообщение и пересылает его связанному пользователю Telegram
3. **Пользователь Telegram** получает сообщение и может ответить
4. **Мост** пересылает ответ обратно первоначальному пользователю MAX
5. Вся переписка остается приватной только между связанными пользователями

## Требования

Перед началом вам нужно:
- Аккаунт в Telegram
- Доступ к мессенджеру MAX (требуется российский/белорусский номер телефона)
- Аккаунт GitHub (бесплатный) ИЛИ можно просто использовать мой публичный репозиторий
- Аккаунт Render (бесплатный)

## Пошаговое руководство по развёртыванию

### Шаг 1: Создайте ваших ботов

#### 1.1 Создание Telegram-бота
1. Откройте Telegram и найдите `@BotFather`
2. Отправьте `/start` боту BotFather
3. Отправьте `/newbot` и следуйте инструкциям:
   - Выберите имя для вашего бота (например, "GreenLine Bridge")
   - Выберите имя пользователя, заканчивающееся на 'bot' (например, "greenlinebridge_bot")
4. **СОХРАНИТЕ ТОКЕН БОТА** - он понадобится позже
5. При желании установите команды, отправив `/setcommands` боту BotFather

#### 1.2 Создание MAX-бота
1. Откройте мессенджер MAX и найдите `@MasterBot`
2. Отправьте `/create` боту MasterBot
3. Следуйте инструкциям:
   - Выберите уникальный ник, заканчивающийся на "bot" или "_bot" (минимум 11 символов)
   - Добавьте отображаемое имя для вашего бота
4. **СОХРАНИТЕ ТОКЕН БОТА**, который пришлёт вам MasterBot
5. Установите вебхук: отправьте `/set_webhook` боту MasterBot (вы обновите это позже)

### Шаг 2 (опционально): Сделайте форк этого репозитория

1. Нажмите кнопку "Fork" в верхней части этой страницы GitHub
2. Это создаст вашу собственную копию GreenLine под вашим аккаунтом GitHub

### Шаг 3: Развёртывание на Render

1. Перейдите на [Render.com](https://render.com) и создайте бесплатный аккаунт
2. Нажмите "New +" и выберите "Web Service"
3. Подключите ваш аккаунт GitHub, если требуется (если был выполнен Шаг 2)
4. Выберите ваш форкнутый репозиторий (если был выполнен Шаг 2) GreenLine ИЛИ можно просто использовать мой публичный репозиторий
5. Настройте сервис:
   - **Name**: выберите любое имя (например, "greenline-bridge")
   - **Region**: выберите ближайший к вашим пользователям
   - **Branch**: main
   - **Build Command**: `yarn install` (по умолчанию)
   - **Start Command**: `node index.js` (по умолчанию)
6. Нажмите "Create Web Service"

### Шаг 4: Настройка переменных окружения

После создания вашего сервиса:

1. Перейдите в панель управления вашим сервисом Render
2. Нажмите на вкладку "Environment"
3. Добавьте эти три переменные окружения:

| Ключ | Значение | Описание |
|------|----------|----------|
| `TELEGRAM_BOT_TOKEN` | Ваш токен Telegram-бота из шага 1.1 | Токен от BotFather |
| `MAX_BOT_TOKEN` | Ваш токен MAX-бота из шага 1.2 | Токен от MasterBot |
| `ADMIN_PASSWORD` | Выберите надёжный пароль | Для доступа к админ-панели |

4. Нажмите "Save Changes"
5. Render автоматически пересобрёт ваш сервис

### Шаг 5: Настройка вебхуков

#### 5.1 Установка Telegram-вебхука
1. Скопируйте URL вашего сервиса Render (что-то вроде `https://yourapp.onrender.com`)
2. Откройте этот URL в браузере: `https://yourapp.onrender.com/setup-tg-webhook`
3. Вы должны увидеть JSON-ответ с `"ok": true`

#### 5.2 Установка MAX-вебхука
1. В MAX отправьте эту команду боту MasterBot:
   `/set_webhook https://yourapp.onrender.com/max-webhook`
2. Замените `yourapp.onrender.com` на ваш реальный URL Render

### Шаг 6: Доступ к админ-панели

1. Откройте вашу админ-панель: `https://yourapp.onrender.com/admin`
2. Введите админ-пароль, который вы установили в шаге 4
3. Вы увидите интерфейс для связывания пользователей

### Шаг 7: Связывание пользователей

Чтобы создать приватный туннель для общения:

1. **Получите ID пользователей:**
   - **ID пользователя Telegram**: пользователь может написать `@userinfobot` в Telegram, чтобы получить свой ID
   - **ID пользователя MAX**: появляется в логах вашего сервиса, когда они впервые пишут вашему MAX-боту

2. **Добавьте пару:**
   - Введите ID пользователя MAX и ID пользователя Telegram в админ-панели
   - Нажмите "Add Pair"

3. **Тестирование:**
   - Пользователь MAX отправляет сообщение вашему MAX-боту
   - Пользователь Telegram должен получить его
   - Пользователь Telegram отвечает, пользователь MAX должен получить ответ

## Инструкции по использованию

### Для пользователей MAX
1. Найдите и начните разговор с вашим MAX-ботом
2. Отправьте любое сообщение - оно будет переслано вашему связанному контакту в Telegram

### Для пользователей Telegram
1. Найдите и запустите ваш Telegram-бот (нажмите "Start")
2. Вы будете получать сообщения от вашего связанного контакта в MAX
3. Отвечайте прямо в чате с ботом - сообщения идут обратно в MAX

### Для администраторов
1. Заходите в админ-панель для управления парами пользователей
2. Добавляйте новые пары, вводя ID пользователей
3. Удаляйте пары, когда они больше не нужны
4. Отслеживайте состояние сервиса через панель Render

## Примечания по безопасности

- **Никогда не делитесь токенами ботов публично**
- **Установите надёжный админ-пароль**
- **Связывайте только тех пользователей, которым доверяете**
- **Отслеживайте логи доступа к админ-панели**
- **Держите ваш репозиторий приватным, если добавляете чувствительные данные**

## Устранение неполадок

### Сервис не запускается
- Проверьте, что все три переменные окружения установлены правильно
- Убедитесь, что токены ботов действительны и полные
- Проверьте логи сервиса Render на наличие конкретных ошибок

### Сообщения не пересылаются
- Убедитесь, что вебхуки установлены правильно для обеих платформ
- Подтвердите, что пользователи правильно связаны в админ-панели
- Проверьте, что пользователи Telegram запустили бота
- Убедитесь, что пользователи MAX имеют разрешение использовать вашего бота

### Админ-панель не загружается
- Подтвердите, что админ-пароль установлен как переменная окружения
- Проверьте, что `/admin` добавлен к URL вашего сервиса
- Убедитесь, что сервис работает и здоров

## Ограничения

- **Бесплатный план Render**: сервис может "засыпать" после 30 минут бездействия
- **Доступ к MAX**: требуется российский/белорусский номер телефона для создания бота
- **Лимиты пользователей**: нет встроенных лимитов, но управляйте парами ответственно
- **Обмен файлами**: текущая версия поддерживает только текст

## Информация о стоимости

- **GitHub**: бесплатно для публичных репозиториев
- **Render**: бесплатный тариф включает 750 часов/месяц (достаточно для непрерывной работы)
- **Telegram Bot**: бесплатно
- **MAX Bot**: бесплатно

**Общая стоимость: 0₽/месяц** при типичном использовании на бесплатных тарифах.

## Правовой дисклеймер

**Развёртывания с использованием этого кода являются исключительной ответственностью развёртывающей стороны; автор не несёт ответственности за их расходы, время работы или обслуживание.**

Это программное обеспечение предоставляется "как есть" без гарантий. Пользователи несут ответственность за соблюдение местных законов и условий использования платформ.

## Поддержка

По вопросам и проблемам:
1. Сначала проверьте это README
2. Просмотрите логи развёртывания Render
3. Проверьте токены ботов и переменные окружения
4. Убедитесь, что вебхуки настроены правильно

## Вклад в проект

Вклады приветствуются! Пожалуйста:
1. Сделайте форк репозитория
2. Создайте ветку для функции
3. Внесите ваши изменения
4. Отправьте pull request

---

## License | Лицензия

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Этот проект лицензирован под лицензией MIT - см. файл [LICENSE](LICENSE) для подробностей.
