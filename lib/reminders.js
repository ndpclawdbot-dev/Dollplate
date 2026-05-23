// Phase 5 stub — populated when Twilio is configured
// This file is dynamically imported by server.js cron job.

async function sendDinnerReminders() {
  // Will be implemented in Phase 5 with Twilio + Supabase queries.
  // Reads household_settings.reminder_time each run so time changes
  // take effect without restarting the server.
}

module.exports = { sendDinnerReminders }
