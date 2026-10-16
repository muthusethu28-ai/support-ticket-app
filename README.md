# Support Ticket Management App

This project helps users raise support tickets and agents manage them through to resolution.

## Tech stack

- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Zod
- Frontend: Angular, Angular Material, Bootstrap CSS, RxJS

## Folder structure

```
backend/
  src/
  scripts/
  .env.example
  package.json
frontend/
  src/
  package.json
```

## How to run

You need Node 18+ and a MongoDB database (Atlas free cluster or local MongoDB).

### Backend

```bash
cd backend
# Windows
copy .env.example .env
# Linux/Mac
cp .env.example .env
```

Open `.env` and set these values:

| Variable       | Meaning                                       |
| -------------- | --------------------------------------------- |
| PORT           | Backend port (default 5000)                   |
| MONGODB_URI    | MongoDB connection string                     |
| JWT_SECRET     | Any long random string                        |
| JWT_EXPIRES_IN | Token expiry, for example 1d                  |
| CLIENT_URL     | Frontend URL for CORS (http://localhost:4200) |

Example URIs:

- Atlas: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/support-tickets`
- Local: `mongodb://localhost:27017/support-tickets`

If you use Atlas, add your IP address in Network Access, otherwise the connection will time out.

Then run:

```bash
npm install
npm run seed
npm run dev
```

Backend runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:4200`.

The frontend calls the API at `http://localhost:5000/api`. This is set in `frontend/src/environments/environment.ts`. Change it there if you change the backend port.

## Sample agent login

- Email: `agent@example.com`
- Password: `Agent@123`
- It is created by running `npm run seed` in `backend/`.
- Normal registration always creates a `user`, never an agent.

## API list

| Method | Path                      | Who can use                             |
| ------ | ------------------------- | --------------------------------------- |
| GET    | /api/health               | Anyone                                  |
| POST   | /api/auth/register        | Anyone                                  |
| POST   | /api/auth/login           | Anyone                                  |
| POST   | /api/tickets              | User                                    |
| GET    | /api/tickets              | User (own tickets), Agent (all tickets) |
| GET    | /api/tickets/:id          | User (own ticket), Agent                |
| PATCH  | /api/tickets/:id/status   | Agent only                              |
| POST   | /api/tickets/:id/comments | User (own ticket), Agent                |

`GET /api/tickets` supports these query params: `page`, `limit`, `status`, `priority`, `search` (title).

## Assumptions

- Only users create tickets; agents manage them.
- Ticket status moves forward only: open -> in-progress -> resolved -> closed.
- Comments are not allowed on closed tickets.
- Register returns a token, so the user is logged in right away.
- Users can only see and comment on their own tickets; agents can see and manage all.
- Only an access token is used and it is stored in localStorage.

## What I would improve with more time

- Add refresh tokens instead of only an access token.
- Add unit and end-to-end tests for backend and frontend.
- Add rate limiting on auth and write endpoints.
- Send real email notifications when ticket status changes.
- Add Docker setup for local development.
- Use NgRx for larger frontend state.
