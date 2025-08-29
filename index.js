import express from 'express';
import { Telegraf } from 'telegraf';
import axios from 'axios';

// Read required secrets from environment
const {
  TELEGRAM_BOT_TOKEN,          // from BotFather
  MAX_BOT_TOKEN,               // from @MasterBot
  WEBHOOK_SECRET_PATH = 'tgwh' // a short secret path for Telegram webhook
} = process.env;

// Basic guard
if (!TELEGRAM_BOT_TOKEN || !MAX_BOT_TOKEN) {
  console.error('Missing TELEGRAM_BOT_TOKEN or MAX_BOT_TOKEN');
  process.exit(1);
}

// Create Express app
const app = express();
app.use(express.json({ limit: '5mb' }));

// Initialize Telegram bot (we’ll control webhook ourselves)
const tg = new Telegraf(TELEGRAM_BOT_TOKEN);

// Minimal in-memory map: which Telegram chat is handling which MAX chat
const maxToTelegram = new Map();   // key: maxChatId, value: telegramChatId
const telegramToMax = new Map();   // key: telegramChatId, value: maxChatId

// 1) Telegram webhook endpoint
app.post(`/${WEBHOOK_SECRET_PATH}`, (req, res) => {
  tg.handleUpdate(req.body);
  res.sendStatus(200);
});

// 2) Telegram message handler → forward to MAX
tg.on('message', async (ctx) => {
  // Ignore commands that start with '/'
  if (ctx.message.text && ctx.message.text.startsWith('/')) return;

  const telegramChatId = String(ctx.chat.id);
  const maxChatId = telegramToMax.get(telegramChatId);

  if (!maxChatId) {
    await ctx.reply('No active MAX conversation is linked yet. Please wait for an incoming MAX message or link a chat first.');
    return;
  }

  const text = ctx.message.text || '(non-text message)';
  try {
    // Send a message to MAX via HTTPS API (POST /messages with access_token)
    await axios.post(
      `https://botapi.max.ru/messages?access_token=${encodeURIComponent(MAX_BOT_TOKEN)}`,
      {
        chat_id: maxChatId,
        text,
        format: 'markdown'
      }
    );
    await ctx.reply('Sent to MAX ✅');
  } catch (err) {
    console.error('Error sending to MAX:', err?.response?.data || err.message);
    await ctx.reply('Failed to send to MAX ❌');
  }
});

// 3) MAX webhook endpoint → forward to Telegram
// Configure this URL in MAX via /set_webhook in @MasterBot or via /subscriptions API
app.post('/max-webhook', async (req, res) => {
  try {
    const update = req.body;

    // Handle the common "message_created" event shape from MAX
    if (update?.type === 'message_created') {
      const chatId = String(update.chat?.chat_id || '');
      const userName = update.user?.name || 'User';
      const text = update.message?.body?.text || '(no text)';
      const existingTg = maxToTelegram.get(chatId);

      if (existingTg) {
        // Already linked: send to existing Telegram chat
        await tg.telegram.sendMessage(existingTg, `💬 From MAX (${userName}):\n${text}`);
      } else {
        // Not linked yet: default to sending to the bot owner if they first send /start
        // For simplicity, link to the first Telegram chat that sends /start after this arrives
        pendingLastMaxChatIdForLink = chatId; // simple global var to link on next /start
        await tg.telegram.sendMessage(process.env.ADMIN_TELEGRAM_CHAT_ID || existingTg || '', `New MAX chat ${chatId} received, but no Telegram chat is linked yet.`);
      }
    }

    res.json({ ok: true });
  } catch (e) {
    console.error('MAX webhook error:', e);
    res.status(500).json({ ok: false });
  }
});

// 4) Simple linking flow: an agent in Telegram runs /start to attach to latest MAX chat received
let pendingLastMaxChatIdForLink = null;

tg.start(async (ctx) => {
  const telegramChatId = String(ctx.chat.id);
  if (pendingLastMaxChatIdForLink) {
    // Link these two chats
    maxToTelegram.set(pendingLastMaxChatIdForLink, telegramChatId);
    telegramToMax.set(telegramChatId, pendingLastMaxChatIdForLink);
    await ctx.reply(`Linked to MAX chat ${pendingLastMaxChatIdForLink} ✅\nYou can now reply here to message the MAX user.`);
    pendingLastMaxChatIdForLink = null;
  } else {
    await ctx.reply('Send a message to your MAX bot first. When it arrives here, use /start to link this Telegram chat.');
  }
});

// 5) Helper endpoint to programmatically set the Telegram webhook to this service URL
// Call once after deployment: open https://<your-render-url>/setup-tg-webhook
app.get('/setup-tg-webhook', async (req, res) => {
  try {
    // Infer public URL from the request
    const publicBase = `${req.protocol}://${req.get('host')}`;
    const webhookUrl = `${publicBase}/${WEBHOOK_SECRET_PATH}`;
    const ok = await tg.telegram.setWebhook(webhookUrl);
    res.json({ ok, webhookUrl });
  } catch (e) {
    console.error('setWebhook failed:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Bridge listening on port ${PORT}`);

  // Telegraf in webhook mode (do not use polling)
  // We set webhook via /setup-tg-webhook endpoint to avoid hardcoding the URL
});
