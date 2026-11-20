# Deploying to cPanel (Namecheap)

The production setup runs **one Node.js app** that serves both the API and the built React frontend, backed by a **PostgreSQL** database — all manageable from cPanel.

## 1. Create the PostgreSQL database

1. cPanel → **PostgreSQL® Databases**
2. Create a database (e.g. `olamartins_db`) and a user (e.g. `olamartins_user`) with a strong password.
3. **Add the user to the database** with **ALL PRIVILEGES**.
4. Note the full names — cPanel prefixes them with your cPanel username, e.g. `cpuser_olamartins_db`.
5. Optional: open **phpPgAdmin** and run `database/schema.sql` in that database. (Not required — the server also applies the schema automatically on first start.)

## 2. Upload the code

Use cPanel → **Git™ Version Control** (clone this repository into a folder such as `~/ola-martins-site`), or upload the files via FTP into the same folder.

## 3. Create the Node.js application

1. cPanel → **Setup Node.js App** → **Create Application**
2. Settings:
   - **Node.js version**: 20.x or 22.x (LTS)
   - **Application mode**: Production
   - **Application root**: the folder you cloned/uploaded to (repo root)
   - **Application URL**: your domain (`olamartins.com`) or a staging subdomain
   - **Application startup file**: `server/src/index.js`
3. In the **Environment variables** section, add:

   | Key | Value |
   | --- | ----- |
   | `NODE_ENV` | `production` |
   | `PORT` | the port shown by cPanel (e.g. `5000`) |
   | `CLIENT_URL` | `https://olamartins.com` |
   | `JWT_SECRET` | a long random string (e.g. output of `openssl rand -hex 32`) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `COOKIE_SECURE` | `true` (site is HTTPS) |
   | `DB_HOST` | `localhost` |
   | `DB_PORT` | `5432` |
   | `DB_NAME` | full prefixed DB name |
   | `DB_USER` | full prefixed DB user |
   | `DB_PASSWORD` | the DB password |
   | `ADMIN_NAME` | `Ola Martins` |
   | `ADMIN_EMAIL` | your admin email |
   | `ADMIN_PASSWORD` | a strong initial admin password (change later by re-running seed with a new value, or update the hash in the DB) |

4. Click **Create**, then open the app folder in cPanel → **Terminal** and run:

   ```bash
   cd ~/ola-martins-site
   npm install          # installs client + server dependencies
   npm run build        # builds the React app into client/dist
   npm run seed         # creates tables, admin account and placeholder content
   ```

5. Back in **Setup Node.js App**, click **Restart** (or **Run NPM Install / Run JS Script** as needed).

If your domain is served from `public_html` by Apache, either:
- point the Node app at the root domain in "Setup Node.js App" (Passenger proxies it automatically), or
- add a `.htaccess` in `public_html` proxying to the Node port:

```
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ http://127.0.0.1:5000/$1 [P,L]
```

(adjust the port to the one cPanel assigned; keep `/api` and static assets going to the Node app).

## 3b. Email notifications (free)

The "Get a Free Consultation" form stores every request in the database (visible at
`/admin/messages`) **and** emails a full notification to your inbox — no paid API.

- On cPanel, `/usr/sbin/sendmail` exists by default, so the Node server sends mail
  through it automatically. Just set these env vars in "Setup Node.js App":

  | Key | Value |
  | --- | ----- |
  | `MAIL_FROM` | `no-reply@olamartins.com` (use an address on your domain) |
  | `NOTIFY_EMAIL` | the inbox that receives new requests (e.g. your Gmail) |
  | `SENDMAIL_PATH` | `/usr/sbin/sendmail` (default) |

- To make delivery reliable (avoid spam folders): create the `no-reply@olamartins.com`
  mailbox or a forwarder in cPanel → **Email Accounts / Forwarders**, and enable
  **SPF + DKIM** via cPanel → **Email Deliverability** (fix any records it flags).
- If sendmail is unavailable, the form still works — the request is saved and shown
  in the admin; the server logs a warning. Free alternatives if you ever want them:
  Brevo (300 emails/day free) or SMTP2GO via SMTP, wired in `server/src/utils/mailer.js`.

Uploaded images from the admin CMS are stored in `server/uploads/` (served at
`/uploads/...`) — make sure that folder is writable (`chmod 755`).

## 4. SSL

cPanel → **SSL/TLS Status** → **Run AutoSSL** so `https://olamartins.com` is issued. `COOKIE_SECURE=true` requires HTTPS.

## 5. Go live with content

1. Visit `https://olamartins.com/admin/login` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
2. Replace the placeholder **Resources**, **Products** and **Articles**.
3. For each shop product, create it on [Selar](https://selar.co) and paste the Selar checkout URL into the product form — buyers are redirected there to pay and receive the file.
4. Update **Settings** (hero text, contact info, socials).

## Updating later

Pull new code in cPanel Git™ Version Control (or re-upload), then in the terminal:

```bash
cd ~/ola-martins-site
npm install
npm run build
# restart the Node app from "Setup Node.js App"
```

Schema changes: edit `database/schema.sql` and re-run it in phpPgAdmin (it uses `IF NOT EXISTS`, so it is safe), or simply restart the app — the schema is applied automatically on boot.

## Troubleshooting

- **App shows "It works!" or 404s**: the startup file path or application root is wrong in "Setup Node.js App".
- **API 500 errors**: check DB credentials; view logs via cPanel → the Node app's `stderr`/`output` files in the app folder.
- **Login fails after deploy**: make sure `COOKIE_SECURE=true` only when the site is HTTPS, and `CLIENT_URL` matches the exact origin (no trailing slash).
- **Database connection refused**: confirm PostgreSQL is running (cPanel → PostgreSQL) and `DB_HOST=localhost`, `DB_PORT=5432`.
