# KidLearn Max (Pro – PT)

Sistema web completo (frontend + backend + banco) com design **branco + azul**, responsivo e profissional.
Foco em português por padrão (PT), com internacionalização disponível.

## Importante – Erro MongoDB (Windows)
Se você viu `ECONNREFUSED ::1:27017` ou `127.0.0.1:27017`, é porque o MongoDB **não está rodando localmente**.
Soluções:

### Opção A) Usar MongoDB Atlas (recomendado)
1. Crie um cluster gratuito no Atlas.
2. Crie um usuário do banco e **libere seu IP (0.0.0.0/0 para testes)**.
3. Pegue a connection string e use no backend `.env`:
```
MONGO_URI=mongodb+srv://SEU_USER:SUA_SENHA@SEU_CLUSTER.mongodb.net/kidlearn_max?retryWrites=true&w=majority
```
> No Windows, isso evita o problema de resolver `localhost` para IPv6 `::1`.

### Opção B) Instalar MongoDB local
1. Instale o MongoDB Community Server e **inicie o serviço**.
2. Use no `.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/kidlearn_max
```
> Note o `127.0.0.1` (força IPv4 e evita `::1`).

---

## Rodando
### Backend
```bash
cd backend
cp .env.example .env
# Edite .env: MONGO_URI (Atlas ou 127.0.0.1), JWT_SECRET, CORS_ORIGIN
npm install
npm run dev  # http://localhost:4000
```

### Frontend
```bash
cd frontend
echo "VITE_API_URL=http://localhost:4000" > .env
npm install
npm run dev  # http://localhost:5173
```

## Fluxo
1. Registrar → Login → Pacientes (criar/selecionar) → Atividades.
2. Atividades (PT): **AAC (com emojis)**, **Emoções (PT)**, **Rotinas**, **Cores**, **Números**, **Letras (A–Z)**, **Memória**, **Puzzle**.

## Deploy rápido
- Backend: Render (defina `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN` = URL do seu front).
- Frontend: GitHub Pages (workflow pronto em `.github/workflows/frontend.yml`).

Boa sorte! 🚀
