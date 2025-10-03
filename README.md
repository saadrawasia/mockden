# Mockden - Rapid API Prototyping & Mock Data

Mockden helps developers prototype APIs with custom schemas and mock data. Fast, scalable, and ideal for testing.

> [!Disclaimer]
> This project is no longer maintained. It is provided **as-is** under the chosen open source license.  
Use at your own risk. No support will be provided.

---

## 📖 Overview

This repository contains the source code of a SaaS application built with an **Nx monorepo**.  
It includes:

- **Frontend** – React + Vite, TanStack Router, Zustand, Tailwind CSS, TanStack Form, Zod  
- **Backend** – Node.js + Express, PostgreSQL, Drizzle ORM, Zod  
- **Docs** – Docusaurus  

Authentication is handled with **Clerk** and payments with **Paddle**.  

---

## 🛠️ Tech Stack

### Frontend
- React + Vite  
- TanStack Router  
- Zustand (state management)  
- Tailwind CSS (styling)  
- TanStack Form (forms)  
- Zod (validation)  

### Backend
- Node.js + Express  
- PostgreSQL  
- Drizzle ORM  
- Zod  

### Other
- Clerk (auth & user management)  
- Paddle (payments)  
- Nx (monorepo management)  
- Docusaurus (docs site)  

---

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18)  
- PostgreSQL  
- Nx CLI  

### Install Nx

You can install the Nx CLI globally:

```bash
npm install -g nx
```

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
pnpm install
```

### Environment Variables
Copy `.env.template` file from the root directory and create `.env` file in the root directory

### Run Locally

```bash
# Frontend
nx run @mockden/frontend:serve

# Backend
nx run @mockden/backend:serve

# Docs
nx run @mockden/mockden-docs:serve
```

## 📝 License
MIT License

Copyright (c) [2025] [Saad Rawasia]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 🙌 Acknowledgements

This repo was originally built as a SaaS product and is now open sourced for the community.
Thanks to the maintainers of all the libraries and tools used here.