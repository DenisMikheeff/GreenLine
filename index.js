import express from 'express';
import { Telegraf } from 'telegraf';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

// Read required secrets from environment
const {
  TELEGRAM_BOT_TOKEN,          // from BotFather
  MAX_BOT_TOKEN,               // from @MasterBot
  WEBHOOK_SECRET_PATH = 'tgwh',// for Telegram webhook
  ADMIN_PASSWORD               // set this in Render Environment!
} = process.env;

if (!TELEGRAM_BOT_TOKEN || !MAX_BOT_TOKEN || !ADMIN_PASSWORD) {
  console.error('Missing TELEGRAM_BOT_TOKEN or MAX_BOT_TOKEN or ADMIN_PASSWORD');
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: '5mb' }));

const tg = new Telegraf(TELEGRAM_BOT_TOKEN);

// --- In-memory pairing storage (reset when the server restarts) ---
let pairings = {}; // key: maxUserId (string), value: telegramUserId (string)

// --- Admin panel password middleware ---
function requireAdminPassword(req, res, next) {
  const pass =
    req.query.password ||
    req.body?.password ||
    req.headers['x-admin-password'];
  if (pass === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).send('Unauthorized: admin password required.');
  }
}

// --- Admin panel routes ---
// Serve static HTML admin panel
app.get('/admin', requireAdminPassword, (req, res) => {
  res.sendFile(
    path.join(path.dirname(fileURLToPath(import.meta.url)), 'admin.html')
  );
});

// Get all pairs
app.get('/admin/pairs', requireAdminPassword, (req, res) => {
  res.json(Object.entries(pairings));
});

// Add new pair
app.post('/admin/pairs', requireAdminPassword, (req, res) => {
  const { maxId, tgId } = req.body;
  if (!maxId || !tgId) return res.status(400).json({ error: 'Both IDs required' });
  pairings[maxId] = tgId;
  res.json({ ok: true });
});

// Remove pair
app.delete('/admin/pairs/:maxId', requireAdminPassword, (req, res) => {
  delete pairings[req.params.maxId];
  res.json({ ok: true });
});

// --- Telegram webhook endpoint ---
app.post(`/${WEBHOOK_SECRET_PATH}`, (req, res) => {
  tg.handleUpdate(req.body);
  res.sendStatus(200);
});

// --- Telegram message handler: Only forward to paired MAX user ---
tg.on('message', async (ctx) => {
  if (ctx.message.text && ctx.message.text.startsWith('/')) return;
  const tgUserId = String(ctx.from.id);
  // Find the paired MAX user for this Telegram user
  const maxUserId = Object.entries(pairings)
    .find(([max, tg]) => tg === tgUserId)?.[0];
  if (!maxUserId) {
    await ctx.reply('You are not paired with a MAX user (contact admin)');
    return;
  }
  const text = ctx.message.text || '(non-text message)';
  try {
    await axios.post(
      `https://botapi.max.ru/messages?access_token=${encodeURIComponent(MAX_BOT_TOKEN)}`,
      {
        chat_id: maxUserId,
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

// --- MAX webhook endpoint: Only forward to paired Telegram user ---
app.post('/max-webhook', async (req, res) => {
  try {
    const update = req.body;
    if (update?.type === 'message_created') {
      const maxUserId = String(update.user?.user_id);
      const tgUserId = pairings[maxUserId];
      if (tgUserId) {
        const text = update.message?.body?.text || '(no text)';
        const userName = update.user?.name || 'User';
        await tg.telegram.sendMessage(tgUserId, `💬 From MAX (${userName}):\n${text}`);
      }
      // If not paired, do nothing
    }
    res.json({ ok: true });
  } catch (e) {
    console.error('MAX webhook error:', e);
    res.status(500).json({ ok: false });
  }
});

// Helper endpoint for Telegram setWebhook
app.get('/setup-tg-webhook', async (req, res) => {
  try {
    const publicBase = `${req.protocol}://${req.get('host')}`;
    const webhookUrl = `${publicBase}/${WEBHOOK_SECRET_PATH}`;
    const ok = await tg.telegram.setWebhook(webhookUrl);
    res.json({ ok, webhookUrl });
  } catch (e) {
    console.error('setWebhook failed:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Bridge listening on port ${PORT}`);
});
