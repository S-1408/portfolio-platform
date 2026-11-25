# Deployment

How `apps/portfolio` is built, tested and deployed, and the one-time steps to
set it up on Vercel with your own domain. Nothing here deploys automatically
until you connect the repository to Vercel.

Throughout this guide, replace `yourdomain.com` with your real domain.

- [1. What CI does](#1-what-ci-does)
- [2. Create the Vercel project](#2-create-the-vercel-project)
- [3. Environment variables](#3-environment-variables)
- [4. Analytics and Speed Insights](#4-analytics-and-speed-insights)
- [5. Connect your custom domain](#5-connect-your-custom-domain)
- [6. Email sending domain (Resend)](#6-email-sending-domain-resend)
- [7. Retire the old GitHub Pages site](#7-retire-the-old-github-pages-site)
- [8. After launch](#8-after-launch)

---

## 1. What CI does

`.github/workflows/ci.yml` runs on every pull request and on every push to
`main`:

1. `pnpm install --frozen-lockfile`, with the pnpm store cached.
2. `turbo run lint typecheck test build`. On pull requests only the packages
   that changed against `main`, plus everything that depends on them, run
   (`--filter="...[origin/main]"`). On `main` everything runs.
3. If `apps/portfolio` or one of its dependencies changed:
   - **Playwright e2e and axe** against the production build (`e2e/`).
   - **Lighthouse CI** on `/`, `/projects`, a project page and `/resume`, 3
     runs each, median score. The build fails below **performance 0.90,
     accessibility 0.95, SEO 0.95**. Best practices below 0.90 only warns.
4. Playwright and Lighthouse reports are uploaded as workflow artifacts. They
   are not published publicly.

> **Why Lighthouse uses the desktop profile:** GitHub's shared runners make
> Lighthouse's simulated mobile CPU too noisy for a hard gate. Locally, mobile
> medians are currently 89–93, so a 0.90 mobile budget would fail randomly.
> To gate on mobile, delete `preset: "desktop"` in `lighthouserc.cjs` once
> mobile is reliably above 0.90.

### Recommended GitHub settings

- **Branch protection:** In **Settings → Branches → Add rule** for `main`,
  enable **Require status checks to pass** and select
  `Lint, typecheck, test, build, e2e, Lighthouse`. Also enable **Require a pull
  request before merging**.
- **Code owners:** `.github/CODEOWNERS` assigns reviews to `@S-1408`.
- **Dependabot:** opens grouped PRs every Monday (`.github/dependabot.yml`).
- **Optional Vercel Remote Cache** (shares Turborepo build cache between CI
  and Vercel):
  - Create a Vercel access token and add it as the repository secret
    `TURBO_TOKEN`.
  - Add your Vercel team slug as the repository variable `TURBO_TEAM`
    (**Settings → Secrets and variables → Actions → Variables**).

  CI works without these. It just uses the local cache.

---

## 2. Create the Vercel project

Each zone is its own Vercel project. This one is for `apps/portfolio`. The
future blog will be a second project.

1. Go to <https://vercel.com/new> and import `S-1408/portfolio-platform`.
2. On **Configure Project**:

   | Setting          | Value                                                                 |
   | ---------------- | --------------------------------------------------------------------- |
   | Project Name     | `portfolio` (any name)                                                |
   | Framework Preset | **Next.js** (auto-detected)                                           |
   | Root Directory   | **`apps/portfolio`** (click **Edit**)                                 |
   | Build Command    | Override: `cd ../.. && pnpm turbo run build --filter=@repo/portfolio` |
   | Output Directory | leave default                                                         |
   | Install Command  | leave default (`pnpm install`, run at the repo root)                  |

   The build command must build the workspace packages too: `@repo/content`,
   `@repo/lib` and `@repo/ui` are consumed from their compiled `dist/`.

3. Under **Environment Variables**, add the variables from
   [section 3](#3-environment-variables). At minimum, add
   `ENABLE_EXPERIMENTAL_COREPACK=1` before the first deploy.
4. Click **Deploy**. The first deployment gets a `*.vercel.app` URL.

Then, in the project's **Settings**:

5. **Build and Deployment:**
   - **Node.js Version:** **24.x**. The repo requires Node ≥ 24.
   - **Root Directory:** keep **Include files outside the root directory in
     the Build Step** enabled. The app imports packages from `packages/`.
6. **Git → Ignored Build Step:** choose **Custom** and enter:

   ```sh
   npx turbo-ignore --fallback=HEAD^1
   ```

   `turbo-ignore` skips the deployment when nothing that `@repo/portfolio`
   depends on has changed. For example, a commit that only touches `e2e/` or
   `docs/` won't redeploy. `--fallback=HEAD^1` compares against the previous
   commit when Vercel has no earlier deployment to compare with.

7. **Git → Production Branch:** `main`. Every other branch and every pull
   request gets a Preview deployment.

> **Why Corepack:** the repo pins `pnpm@11.5.1` in `package.json`
> (`packageManager`). Without `ENABLE_EXPERIMENTAL_COREPACK=1`, Vercel picks a
> pnpm version from the lockfile format, which may differ from 11.5.1.

---

## 3. Environment variables

Set these in **Settings → Environment Variables**. `NEXT_PUBLIC_*` values and
`BLOG_URL` are read at **build time**, so redeploy after changing them
(**Deployments → ⋯ → Redeploy**).

| Variable                       | Production                                | Preview                                | Notes                                                                                                                                                                            |
| ------------------------------ | ----------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`         | `https://yourdomain.com`                  | _(leave unset)_                        | Canonical URLs, OG images, sitemap and robots. If unset, falls back to the Vercel production domain. Previews are never indexed either way.                                      |
| `RESEND_API_KEY`               | your Resend API key, marked **Sensitive** | optional                               | If missing, the contact form tells visitors to email you directly instead of failing.                                                                                            |
| `CONTACT_TO_EMAIL`             | inbox that receives messages              | same as Production, if you set the key | Server-only.                                                                                                                                                                     |
| `CONTACT_FROM_EMAIL`           | `Portfolio <hello@yourdomain.com>`        | same                                   | Optional until you verify your domain in Resend ([section 6](#6-email-sending-domain-resend)). Before that, Resend's test sender only delivers to your own Resend account email. |
| `NEXT_PUBLIC_ENABLE_BLOG`      | `false`                                   | `false`                                | Set to `true` once the blog zone is live, to show the **Blog** nav link.                                                                                                         |
| `BLOG_URL`                     | _(empty for now)_                         | _(empty)_                              | Later: the blog project's production URL, e.g. `https://portfolio-blog.vercel.app`. When set, `/blog`, `/blog/*` and `/blog-static/*` are rewritten to it (Multi-Zones).         |
| `ENABLE_EXPERIMENTAL_COREPACK` | `1`                                       | `1`                                    | Makes Vercel use the pinned pnpm version.                                                                                                                                        |

Vercel provides `VERCEL`, `VERCEL_ENV` and `VERCEL_PROJECT_PRODUCTION_URL`
automatically. Keep **Automatically expose System Environment Variables**
enabled (the default).

For local development, copy `apps/portfolio/.env.example` to
`apps/portfolio/.env.local`.

---

## 4. Analytics and Speed Insights

The code is already in `apps/portfolio/app/layout.tsx`. It renders only in
builds made on Vercel, so local and CI builds don't request the missing
`/_vercel/*` scripts.

1. Open the project in Vercel, go to the **Analytics** tab and click **Enable**.
2. Go to the **Speed Insights** tab and click **Enable**.
3. Redeploy. Data appears after the first real visits.

---

## 5. Connect your custom domain

Recommended setup: the **apex domain** (`yourdomain.com`) is primary, and
`www` redirects to it.

1. In Vercel, open **Settings → Domains** and add `yourdomain.com`. When Vercel
   offers to add `www.yourdomain.com` with a redirect, accept it. You can
   change the redirect afterwards with **Edit** on the `www` entry: **Redirect
   to** `yourdomain.com`, status **308**.
2. Vercel then shows the exact DNS records to create. Add them at your
   registrar's DNS settings:

   | Type    | Name / Host | Value                  | TTL            |
   | ------- | ----------- | ---------------------- | -------------- |
   | `A`     | `@`         | `76.76.21.21`          | 3600 (or Auto) |
   | `CNAME` | `www`       | `cname.vercel-dns.com` | 3600 (or Auto) |

   Vercel sometimes shows a **project-specific** value instead, such as a
   different A record IP or a CNAME like `xxxx.vercel-dns-017.com`. Always use
   exactly what the Domains page shows.

3. Remove any records that conflict with these:
   - Other `A` or `AAAA` records on `@`, such as a registrar parking page or
     GitHub Pages IPs `185.199.108.153` to `185.199.111.153` and
     `2606:50c0:800x::153`.
   - Any other `CNAME` on `www`, such as `s-1408.github.io`.
   - If your DNS has **CAA** records, add `0 issue "letsencrypt.org"` so Vercel
     can issue the SSL certificate.
4. Wait for both domains to show **Valid Configuration** in Vercel. This
   usually takes minutes, and up to 48 hours depending on TTLs. HTTPS
   certificates are issued automatically.
5. Set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` for **Production** and
   **redeploy**.
6. Check that:
   - `https://www.yourdomain.com` redirects to `https://yourdomain.com`.
   - `https://yourdomain.com/robots.txt` and `/sitemap.xml` show your domain,
     not `vercel.app` or `localhost`.
   - View-source on the home page shows
     `<link rel="canonical" href="https://yourdomain.com">`.

_Alternative:_ instead of individual records, you can point your domain's
nameservers to `ns1.vercel-dns.com` and `ns2.vercel-dns.com` so Vercel manages
all DNS. Copy over any existing email records (MX/TXT) first.

---

## 6. Email sending domain (Resend)

Optional, but needed if the contact form should deliver to any inbox other
than your Resend account email.

1. In Resend, go to **Domains → Add Domain** and add `yourdomain.com`. A
   subdomain such as `mail.yourdomain.com` keeps sending reputation separate.
2. Add the records Resend shows at your DNS provider: an SPF `TXT` record and
   `MX` record on the sending subdomain, plus a DKIM `TXT` record such as
   `resend._domainkey`. Copy the values exactly. They don't conflict with the
   Vercel records above.
3. When the domain shows **Verified**, set `CONTACT_FROM_EMAIL` (e.g.
   `Portfolio <hello@yourdomain.com>`) in Vercel. Server-only variables take
   effect on the next deployment.
4. Send yourself a test message through the contact form on the live site.

---

## 7. Retire the old GitHub Pages site

The old site lives in the `S-1408/sonam-verma.github.io` repository. GitHub
Pages can't send real HTTP 301 redirects, so the safe approach is: **launch
first, then turn the old site into a redirect, and only unpublish much
later.**

### 7.1 Find out how it's served

Open the old repo's **Settings → Pages**:

- **No custom domain** (the repo has no `CNAME` file, so this is likely): the
  site is at `https://s-1408.github.io/sonam-verma.github.io/`. Follow 7.2.
- **A custom domain is listed:** do 7.3 first, then 7.2.

### 7.2 Replace the old site with redirects

Only do this after the new site is live on your domain.

1. In the old repo, replace `index.html` **and** `404.html` with the page
   below. `404.html` catches deep links and the old PDF URLs. It keeps the
   section anchor (`#about`, `#contact`, and `#project` → `#projects`) and
   tells search engines where the content moved:

   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="utf-8" />
       <title>Moved to yourdomain.com</title>
       <link rel="canonical" href="https://yourdomain.com/" />
       <meta name="robots" content="noindex, follow" />
       <meta http-equiv="refresh" content="0; url=https://yourdomain.com/" />
       <script>
         var hash = location.hash === "#project" ? "#projects" : location.hash;
         location.replace("https://yourdomain.com/" + hash);
       </script>
     </head>
     <body>
       <p>
         This site has moved to
         <a href="https://yourdomain.com/">yourdomain.com</a>.
       </p>
     </body>
   </html>
   ```

2. Delete the old resume PDFs, `css/`, `js/`, `images/` and `webfonts/`.
   Requests for them then hit `404.html` and redirect too. Keep `robots.txt`
   allowing crawling, so search engines can see the redirect.
3. Commit and push. Check that the old URL now lands on the new site.

### 7.3 Only if the old site had a custom domain

Order matters here. A domain that still points at GitHub Pages without being
claimed by a repo can be **taken over** by someone else's Pages site.

1. Add the domain in Vercel and change DNS ([section 5](#5-connect-your-custom-domain)).
   Wait until Vercel shows **Valid Configuration**.
2. Only then, in the old repo's **Settings → Pages**, remove the custom domain,
   and delete its `CNAME` file.
3. Remove any leftover GitHub Pages `A`/`AAAA`/`CNAME` records from DNS.
4. In your GitHub **account settings → Pages → Add a verified domain**, verify
   `yourdomain.com` with the `TXT` record GitHub shows. This stops other
   accounts from ever publishing Pages on it.

### 7.4 Move search and links over

1. In [Google Search Console](https://search.google.com/search-console), add a
   **Domain** property for `yourdomain.com` (DNS TXT verification) and submit
   `https://yourdomain.com/sitemap.xml`.
   - Search Console's _Change of Address_ tool can't be used, because it needs
     a root domain you control and the old site is a `github.io` subpath. The
     canonical link and redirect handle the move instead.
2. Update links that point at the old site:
   - Your GitHub profile **Website** field and profile README.
   - The old repo's **About → Website**.
   - LinkedIn, Instagram bio, and the link inside your resume PDF.

### 7.5 Unpublish (optional, months later)

Keep the redirect stub live for at least **3–6 months**: it's free, and old
links keep working. Once Search Console shows the new pages indexed and the old
URL no longer appears in results:

1. In the old repo, go to **Settings → Pages** and **Unpublish site**, or set
   **Source** to _None_.
2. Under **Settings → General**, use **Archive this repository** to keep the
   history read-only. Prefer this to deleting.

If you'd rather keep the redirect forever, skip step 1 and only archive.
Afterwards, check that the old URL still redirects.

---

## 8. After launch

- **Smoke test:**
  - Home, `/projects` (filters and search), a project page, `/resume`
    (PDF and download), and a 404.
  - Contact form: send yourself a message.
  - Light and dark theme.
- **Social previews:** paste your URL into a link-preview tool, such as
  LinkedIn's Post Inspector, to check the generated OG images.
- **Rollback:** in **Deployments**, open a previous production deployment and
  choose **Instant Rollback**.
- **Adding the blog later:**
  1. Create a second Vercel project with Root Directory `apps/blog`
     (`basePath: "/blog"`, `assetPrefix: "/blog-static"`).
  2. Set `BLOG_URL` here to its production URL and
     `NEXT_PUBLIC_ENABLE_BLOG=true`, then redeploy this project.
