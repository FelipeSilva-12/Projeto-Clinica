# Sistema de Atendimento Inteligente para Clínicas

Aplicação web com **Vue.js + Node.js + MongoDB** para:
- cadastro e login com JWT;
- agendamento com validação de horário disponível;
- consulta de endereço por CEP (ViaCEP);
- consulta de clima (OpenWeatherMap);
- painel com lista de agendamentos.

## Estrutura
- `Backend/` API em Express + Mongoose
- `frontend/` SPA em Vue 3 + Vite

## Banco de dados (MongoDB local)
No backend, use no `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/clinicaDB
JWT_SECRET=super_secreto_clinica_123
OPENWEATHER_API_KEY=sua_chave
```

> O backend aceita `MONGODB_URI` e `MONGO_URI`.

Se seu Mongo exigir autenticação, use formato:

```env
MONGODB_URI=mongodb://admin:clinica123@127.0.0.1:27017/clinicaDB?authSource=admin
```

## Rodando o projeto
### Backend
```bash
cd Backend
npm start
```

### Frontend
```bash
cd frontend
npm run dev
```

Acesse: `http://localhost:5173`

## Endpoints principais
- `POST /auth/cadastro`
- `POST /auth/login`
- `POST /agendamentos` (autenticado)
- `GET /agendamentos` (autenticado)
