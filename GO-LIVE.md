# Going live: Squarespace → Vercel

Work top to bottom. Steps 1–2 are safe to do any time; step 3 is the one that
actually switches the site over, and step 4 is what protects your email.

---

## 0. Before anything: the video problem

**23 video files are in `.gitignore` and are NOT in the repo.** If you push to
GitHub and let Vercel build from it, the site deploys with no videos — every slot
falls back to the "pending export" placeholder.

Pick one:

**A — Commit them (simplest).** Delete the `assets/video/*.mp4` line from
`.gitignore`, then `git add -A && git commit`. ~220 MB total. GitHub will warn
about `sketchbook-scroll.mp4` (60 MB) since it's over the 50 MB soft limit, but it's
under the 100 MB hard limit, so it will go through.

**B — Deploy from your machine** with the Vercel CLI (`vercel --prod`), which
uploads the folder as-is including ignored files. Keeps the repo small, but the
deploy is only reproducible from your Mac.

**C — Move video to a host** (you already use Vimeo). Best long-term for bandwidth
and load time, most work up front.

A is the fastest route to live. C is where this probably wants to end up.

---

## 1. Contact form (Formspree)

1. Sign up at [formspree.io](https://formspree.io), create a form.
2. Set its notification address to **alex@alexmotion.com** and confirm the
   verification email Formspree sends you.
3. Copy the endpoint — it looks like `https://formspree.io/f/abcdwxyz`.
4. In `contact.html`, replace `YOUR_FORM_ID` in the `<form action>` with that ID.

That's the only edit. Until it's done, Submit shows an inline "not connected yet"
notice instead of posting into a dead endpoint.

Free tier is 50 submissions/month. Test it once after going live — including
checking that **Reply** in your inbox goes back to the sender, not to Formspree.

---

## 2. Deploy to Vercel

1. Push this repo to GitHub (private is fine).
2. [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Framework preset: **Other**. No build command, no output directory — it's plain
   static files, so leave those blank.
4. Deploy. You get a `something.vercel.app` URL.

**Check the preview URL before touching DNS.** Specifically: videos play, the form
submits, and the fonts look right (see step 5 — they probably won't yet).

---

## 3. Point the domain

There are two ways, and they carry very different risk to your email.

### Recommended: keep DNS where it is, change only the website records

Leave your nameservers alone. At whoever currently hosts your DNS, change just the
website records to the values Vercel gives you in **Project → Settings → Domains**
(typically an `A` record for `alexmotion.com` and a `CNAME` for `www`).

**Your MX records are untouched, so your email cannot break.** This is the whole
reason to prefer this path.

### Riskier: move nameservers to Vercel

If you point nameservers at Vercel, Vercel becomes responsible for *all* DNS — and
every record that isn't recreated there simply stops existing. That includes your
email. Only do this if you're comfortable rebuilding the full record set, and do
step 4 first.

### Either way, first:

**Export your current DNS records.** In Squarespace: Settings → Domains → your
domain → DNS Settings. Screenshot or copy every record — MX, TXT, CNAME, A, the
lot. This is your undo button.

---

## 4. Email / Google Workspace

**The short version: moving the website should require zero email changes.** Email
is governed by MX records; the website is governed by A/CNAME records. They're
independent. The risk isn't that the migration changes your email — it's that a
DNS move *drops* records that were already there.

So the job is preservation, not configuration:

- **MX records** — these route your mail to Google. If they vanish, inbound email
  stops. **Copy them exactly rather than retyping from a guide**; Google has both a
  modern single-record setup and an older five-record set, and which one you have
  depends on when the account was created.
- **SPF** — a TXT record, usually starting `v=spf1` and including
  `_spf.google.com`.
- **DKIM** — a TXT record on a selector subdomain like `google._domainkey`.
- **DMARC** — a TXT record at `_dmarc.alexmotion.com`, starting `v=DMARC1`.

If you take the recommended path in step 3, you don't touch any of these and
there's nothing to do here.

### Does the contact form need SPF/DKIM/DMARC changes?

**No.** Formspree sends the notification from *its own* domain to your inbox — it
never sends as `@alexmotion.com`, so your domain's sending policy isn't involved.
You're receiving, not sending.

The exception is if you later upgrade to Formspree's custom "from" address, which
sends as your domain. That *would* need SPF and DKIM entries, and Formspree
documents the exact values.

### If you don't have DMARC at all

Worth adding, but it's a separate project from this migration and isn't required to
go live. A monitoring-only policy is the safe way to start:

```
_dmarc.alexmotion.com    TXT    "v=DMARC1; p=none; rua=mailto:alex@alexmotion.com"
```

`p=none` only reports; it doesn't reject anything. Don't move to `p=quarantine` or
`p=reject` until you've watched the reports for a few weeks and confirmed
everything legitimate is passing.

---

## 5. Two things that will silently break in production

**Adobe Fonts is domain-locked.** The kit (`vak5qoq`) currently works on
`localhost`. Add **alexmotion.com**, **www.alexmotion.com**, and your
`*.vercel.app` preview domain in the Adobe Fonts kit settings, or Cubano won't load
and the site quietly falls back to Poppins Bold. Nothing errors — it just looks
wrong.

**Squarespace stays up until you cancel it.** Keep it running until the new site is
live and verified on the real domain. Don't cancel the same day you switch DNS.

---

## Quick post-launch check

- [ ] Every page loads on the real domain
- [ ] Cubano renders (headings look like the logo, not like body text)
- [ ] Videos play, including the square/portrait ones on Play and Character
- [ ] Contact form sends, and Reply goes back to the sender
- [ ] **Send yourself an email from an outside account** — confirms MX survived
- [ ] SYMBOL hover-swap works, on desktop and on a phone
