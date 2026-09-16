# Campus Kart Frontend

Campus Kart is a React + Vite student rental frontend for CITCHENNAI CSE 2025 users.

## Features

- Sign up with an email in the format `name.cse2025@citchennai.net`
- Sign in only after creating an account
- View active rented items
- Report misuse or damage
- Post comments in a public discussion forum

## Requirements

See `REQUIREMENTS.md`.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

This project currently uses browser `localStorage` for demo sign-up, sign-in, and forum comments. Production authentication should use a backend or auth provider.
