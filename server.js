const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const cron = require('node-cron')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0' // required for Replit to expose the port
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error handling request:', err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  }).listen(port, hostname, () => {
    console.log(`> DollPlate ready on http://${hostname}:${port}`)
  })

  // ── Phase 5: Daily dinner reminder SMS ──────────────────────────────────
  // Schedule runs every minute and checks against household reminder_time
  // so time changes take effect without a server restart.
  cron.schedule('* * * * *', async () => {
    try {
      // Dynamically import to avoid loading Supabase/Twilio at server start
      // before env vars are confirmed present.
      const { sendDinnerReminders } = await import('./lib/reminders.js').catch(() => ({ sendDinnerReminders: null }))
      if (sendDinnerReminders) await sendDinnerReminders()
    } catch (err) {
      console.error('Cron sendDinnerReminders error:', err)
    }
  })
})
