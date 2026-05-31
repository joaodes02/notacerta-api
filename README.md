# NotaCerta — API

Serviço Node.js (Fastify + Drizzle + PostgreSQL/Neon) para emissão automática de NFS-e.

## Stack
- Node.js 20+ · Fastify · TypeScript
- Drizzle ORM + PostgreSQL (Railway)
- JWT (sessão gerada pelo NextAuth no frontend)
- Swagger (`/docs`)
- Integrações (próximas fases): Stripe, Focus NFe, Resend, node-cron

## Setup

```bash
npm install
cp .env.example .env   # preencha DATABASE_URL e NEXTAUTH_SECRET
npm run dev
```

Servidor em `http://localhost:3333` · Health check em `/api/health` · Docs em `/docs`.

## Scripts
| Comando              | Descrição                              |
| -------------------- | -------------------------------------- |
| `npm run dev`        | Dev com hot reload (tsx watch)         |
| `npm run build`      | Compila TypeScript para `dist/`        |
| `npm start`          | Roda o build de produção               |
| `npm run typecheck`  | Checagem de tipos sem emitir           |
| `npm run db:generate`| Gera migration a partir do schema      |
| `npm run db:migrate` | Aplica migrations                      |
| `npm run db:studio`  | Abre o Drizzle Studio                  |

## Status — Fase inicial
Fundação do projeto: configuração, conexão com o banco, schema completo, plugins
(CORS, Swagger, JWT) e rota `/health`. Rotas de negócio, Stripe, Focus NFe e o cron
de emissão entram nas próximas fases.
