# 🐄 MoobyStack Starter Kit

### _"I'm not even supposed to be here today!"_

A lightweight, irreverent, View-Askewniverse-infused starter template
for spinning up quick Node.js / TypeScript / React projects in your
homelab, dev box, or whatever server Jay just hotboxed.

This is your **Quick Stop**:\
A place to throw APIs, microservices, scripts, utilities, and random
experiments you'll probably forget about but swear you'll "come back to
later."

---

## 🎬 What This Thing Is

This repo is a backbone for small-to-medium Node/TS + React/Vite apps.

It includes:

- 🟦 **Node.js + TypeScript**
- ⚛️ **React + Vite** (optional front-end shell)
- 🧹 **ESLint + Prettier**
- 🧪 **Vitest/Jest** (your call)
- 🗂️ A sensible folder structure
- 🔧 Reusable scripts for dev, build, lint, etc.

Designed for:

- Homelab utilities\
- Quick APIs\
- Microservices\
- Dashboards\
- Throwaway experiments\
- Late-night "what if?" ideas

---

## 🏗️ Project Structure

    moobystack/
    ├── api/            # Express/Node backend (TypeScript)
    │   ├── src/
    │   ├── tests/
    │   └── ...
    ├── web/            # React front-end via Vite
    │   ├── src/
    │   ├── public/
    │   └── ...
    ├── scripts/        # automation helpers
    ├── .eslintrc.cjs
    ├── tsconfig.json
    ├── package.json
    └── README.md

---

## 🚀 Getting Started

**1. Clone it**

```sh
git clone https://github.com/yourname/moobystack.git
cd moobystack
```

**2. Install dependencies**

```sh
npm install
```

**3. Run dev (API + optional web)**

```sh
npm run dev
```

**4. Build**

```sh
npm run build
```

**5. Lint**

```sh
npm run lint
```

---

## ⚙️ Environment Variables

Create a `.env` file.

Example:

    PORT=3000
    NODE_ENV=development
    DATABASE_URL=postgres://clerks_user:password@localhost:5432/quickstop
    SECRET_KEY=I_AM_THE_MOOBY_MESSIAH

Everything else is up to you --- this is just the foundation.

---

## 🤖 Coding Philosophy (Silent Bob's Manifesto)

- Keep it small\
- Keep it modular\
- Keep it readable\
- Keep it fun\
- Don't break prod\
- Don't _write_ prod\
- Don't let Jay near prod (or yer girl)

---

## 🧪 Testing

Runs either Vitest or Jest.

```sh
npm test
```

Judges your code harsher than Randal judges customers.

---

## 🎯 When to Use This Template

- Homelab automation\
- Personal dashboards\
- Small APIs\
- Microservices\
- CLI tools\
- Random experiments\
- Anything quick and dirty you need running now

---

## 🚫 When _Not_ to Use It

- Enterprise software\
- Huge monorepos\
- Anything needing top-tier type safety\
- Clerks III (too sad)

---

## 🤝 Contributing

PRs welcome.\
Unless you're Randal.\
Then no.

---

## 📜 License

MIT/whatever.\
Just don't sell it to Mooby Corp.
