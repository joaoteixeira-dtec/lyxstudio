# Vanguard — Alojamento Turístico em Cabanas de Tavira

> *"Dormir com a história, acordar com a natureza."*

Website full-stack para alojamento turístico (T4) localizado em Cabanas de Tavira, com sistema de reservas, painel admin, i18n (PT/EN/FR/ES) e acessibilidade.

---

## Stack

| Componente | Tecnologias |
|---|---|
| **Frontend** | React 19 + Vite + TypeScript + TailwindCSS v4 + React Router v7 + react-i18next |
| **Backend** | Node.js + Express + TypeScript + Zod (validação) + JWT |
| **Database** | MySQL (XAMPP) + Knex.js (migrations) |
| **Ambiente** | localhost (Windows) |

---

## Requisitos

- **Node.js** >= 18.x ([download](https://nodejs.org/))
- **XAMPP** com MySQL ativo ([download](https://www.apachefriends.org/))
- **npm** (incluído com Node.js)

---

## Setup Passo a Passo (Windows)

### 1. Iniciar XAMPP

1. Abre o **XAMPP Control Panel**
2. Clica **Start** no **Apache** e no **MySQL**
3. Abre **phpMyAdmin**: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
4. Cria uma nova base de dados chamada `vanguard` (collation: `utf8mb4_general_ci`)

### 2. Instalar dependências

```bash
# Na raiz do projeto
cd backend
npm install

cd ../frontend
npm install
```

### 3. Configurar variáveis de ambiente

O ficheiro `backend/.env` já está pré-configurado para XAMPP padrão:

```env
PORT=3001
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=vanguard
JWT_SECRET=vanguard-secret-change-me-in-production
```

> ⚠️ **Em produção**, altera `JWT_SECRET` para um valor seguro e longo.

O ficheiro `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Executar Migrations e Seeds

```bash
cd backend
npx knex migrate:latest --knexfile knexfile.ts
npx knex seed:run --knexfile knexfile.ts
```

Isto cria as tabelas (`settings`, `bookings`, `blackouts`, `admins`) e insere dados iniciais.

### 5. Iniciar o Backend

```bash
cd backend
npm run dev
```

API disponível em: **http://localhost:3001**

### 6. Iniciar o Frontend

```bash
# Noutra janela de terminal
cd frontend
npm run dev
```

Website disponível em: **http://localhost:5173**

---

## Credenciais Admin (seed)

| Campo | Valor |
|---|---|
| Email | `admin@vanguard.pt` |
| Password | `admin123` |

> ⚠️ **Altera estas credenciais** em produção. O login está em `/admin`.

---

## Endpoints da API

### Públicos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Health check (status + DB) |
| GET | `/api/settings` | Configurações (nome, morada, preço, etc.) |
| GET | `/api/bookings?from=&to=` | Listar reservas (filtro por datas opcional) |
| POST | `/api/bookings` | Criar reserva (estado `pending`) |
| GET | `/api/availability?from=&to=` | Verificar disponibilidade (datas indisponíveis) |

### Admin (requerem `Authorization: Bearer <token>`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/admin/login` | Login → JWT token |
| PATCH | `/api/bookings/:id` | Alterar estado da reserva |
| GET | `/api/availability/blackouts` | Listar blackouts |
| POST | `/api/availability/blackouts` | Bloquear datas |
| DELETE | `/api/availability/blackouts/:id` | Remover blackout |

---

## Exemplos de Requests (curl)

### Criar Reserva

```bash
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "check_in": "2026-07-01",
    "check_out": "2026-07-05",
    "guests": 6,
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "+351912345678",
    "notes": "Chegamos por volta das 16h"
  }'
```

### Login Admin

```bash
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@vanguard.pt", "password": "admin123"}'
```

### Confirmar Reserva (admin)

```bash
curl -X PATCH http://localhost:3001/api/bookings/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"status": "confirmed"}'
```

### Bloquear Datas (admin)

```bash
curl -X POST http://localhost:3001/api/availability/blackouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"date_from": "2026-12-24", "date_to": "2026-12-31", "reason": "Natal"}'
```

### Verificar Disponibilidade

```bash
curl "http://localhost:3001/api/availability?from=2026-07-01&to=2026-07-31"
```

---

## Estrutura do Projeto

```
Vanguard/
├── assets/
│   ├── images/
│   │   ├── exterior/   (14 fotos)
│   │   └── interior/   (13 fotos)
│   └── video/
│       └── hero-video.mp4
├── backend/
│   ├── src/
│   │   ├── index.ts          (entrada principal)
│   │   ├── db.ts             (conexão Knex/MySQL)
│   │   ├── routes/           (health, settings, bookings, availability, admin)
│   │   ├── middleware/        (auth JWT)
│   │   └── validators/       (schemas Zod)
│   ├── migrations/            (4 migrations)
│   ├── seeds/                 (settings + admin)
│   ├── knexfile.ts
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/        (Navbar, Footer, Hero, Calendar, Toast, etc.)
│   │   ├── pages/             (Home, Accommodation, Gallery, History, Reservations, Contact, Admin)
│   │   ├── context/           (Accessibility, Auth)
│   │   ├── services/          (api.ts — fetch wrapper)
│   │   ├── i18n/              (PT, EN, FR, ES)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── .env
└── README.md
```

---

## Funcionalidades

- ✅ **6 páginas**: Home, Alojamento, Galeria, História, Reservas, Contactos
- ✅ **Painel Admin**: Login JWT, gestão de reservas, blackouts
- ✅ **Calendário de disponibilidade**: real (DB + blackouts)
- ✅ **Galeria com lightbox**: filtro exterior/interior
- ✅ **Hero com vídeo**: autoplay, muted, loop (respeita `prefers-reduced-motion`)
- ✅ **i18n**: 4 línguas (PT, EN, FR, ES)
- ✅ **Acessibilidade**: tamanho de letra, alto contraste, Web Speech API, semântica HTML
- ✅ **Design moderno**: TailwindCSS, tipografia serif/sans, palette amber/stone
- ✅ **API REST** com validação Zod, CORS, rate-limit
- ✅ **MySQL** com Knex migrations e seeds

---

## Limitações (fase 1)

- ❌ Pagamentos (MB Way / Cartão / PayPal) — deixamos placeholders e comentários `TODO`
- ❌ Envio real de emails no formulário de contacto (simulado)
- ❌ Upload dinâmico de imagens (assets estáticos)

---

## Licença

Projeto privado — todos os direitos reservados.
