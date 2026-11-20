import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { config } from '../config/env.js';

function sendmailAvailable() {
  try {
    fs.accessSync(config.mail.sendmailPath, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

// Sends a plain-text email through the server's local sendmail (present on
// cPanel/Linux hosts). Returns { sent, reason? } — never throws.
export function sendMail({ to, subject, text }) {
  if (!to) return Promise.resolve({ sent: false, reason: 'No recipient configured (set NOTIFY_EMAIL)' });
  if (!sendmailAvailable()) {
    return Promise.resolve({ sent: false, reason: `sendmail not found at ${config.mail.sendmailPath} (set SENDMAIL_PATH)` });
  }
  const message = [
    `From: Ola Martins Portfolio <${config.mail.from}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="utf-8"',
    '',
    text,
  ].join('\r\n');

  return new Promise((resolve) => {
    try {
      const proc = spawn(config.mail.sendmailPath, ['-t', '-i']);
      proc.on('error', (err) => resolve({ sent: false, reason: err.message }));
      proc.on('close', (code) =>
        resolve(code === 0 ? { sent: true } : { sent: false, reason: `sendmail exited with code ${code}` })
      );
      proc.stdin.write(message);
      proc.stdin.end();
    } catch (err) {
      resolve({ sent: false, reason: err.message });
    }
  });
}
