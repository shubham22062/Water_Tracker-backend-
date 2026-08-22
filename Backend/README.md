# HydroX Backend

REST API for user accounts, water-intake tracking, and administrator user management. The service is built with Express, TypeScript, MongoDB, and Mongoose.

## Requirements

- Node.js 20 or newer
- A running MongoDB instance

## Local Setup

Install dependencies from the `Backend/` directory:

```bash
npm install
```

Create `Backend/.env` with local values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=Your mongodb_URI
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
DEFAULT_DAILY_GOAL_ML=2000
CORS_ORIGIN=replace with hosted backend url

ADMIN_NAME=HydroX Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password
```

The server requires `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Optional values use the defaults shown above.

Start MongoDB, then create the first administrator:

```bash
npm run seed:admin
```

## Scripts

| Command              | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `npm run dev`        | Start the development server with watch mode   |
| `npm run build`      | Compile TypeScript into `dist/`                |
| `npm start`          | Run the compiled server                        |
| `npm run seed:admin` | Create or promote the configured admin account |

## API

The local base URL is `http://localhost:8000/api`. Configure `PORT` and `CORS_ORIGIN` for another local or deployed environment. All responses are JSON, and water values are measured in millilitres.

### Authentication

`POST /auth/register` and `POST /auth/login` return a JWT at `data.token`. `POST /auth/logout` revokes previously issued tokens for that user; the client should also remove its locally stored token.

```http
Authorization: Bearer <token>
```

Use this header for all protected requests. Never place tokens, passwords, or database credentials in source code, commits, URLs, or client-visible logs.

### Endpoint Reference

#### Health

| Method | Endpoint      | Auth | Description                   |
| ------ | ------------- | ---- | ----------------------------- |
| GET    | `/api/health` | None | Check that the API is running |

#### Authentication

| Method | Endpoint             | Body                                                                     |
| ------ | -------------------- | ------------------------------------------------------------------------ |
| POST   | `/api/auth/register` | `{ "name": "Sam", "email": "sam@example.com", "password": "secret123" }` |
| POST   | `/api/auth/login`    | `{ "email": "sam@example.com", "password": "secret123" }`                |
| GET    | `/api/auth/me`       | None; requires a user token                                              |
| POST   | `/api/auth/logout`   | None; requires a user token                                              |

#### User profile

All routes require a user token.

| Method | Endpoint            | Body                                                                |
| ------ | ------------------- | ------------------------------------------------------------------- |
| GET    | `/api/user/profile` | None                                                                |
| PATCH  | `/api/user/profile` | Any of `name`, `age`, `gender`, `weight`, `height`, `activityLevel` |
| DELETE | `/api/user/account` | None                                                                |

Valid `gender` values are `male`, `female`, and `other`. Valid `activityLevel` values are `sedentary`, `light`, `moderate`, `active`, and `very_active`.

#### Water intake

All routes require a user token. `amount` must be a positive number.

| Method | Endpoint              | Body or query                                                               |
| ------ | --------------------- | --------------------------------------------------------------------------- |
| POST   | `/api/intake`         | `{ "amount": 250, "date": "2026-08-22T09:00:00.000Z" }`; `date` is optional |
| GET    | `/api/intake/today`   | Today's logs and progress                                                   |
| GET    | `/api/intake/summary` | Today's totals and progress                                                 |
| GET    | `/api/intake/history` | Optional `startDate` and `endDate` query parameters                         |
| PATCH  | `/api/intake/:id`     | `{ "amount": 300 }`                                                         |
| DELETE | `/api/intake/:id`     | None                                                                        |

Users can only modify or delete their own intake records.

#### Admin

All routes require a token for a user whose database role is `admin`.

| Method | Endpoint                          | Body or query                          |
| ------ | --------------------------------- | -------------------------------------- |
| GET    | `/api/admin/users`                | List users                             |
| GET    | `/api/admin/users/:id`            | Get one user                           |
| GET    | `/api/admin/users/:id/intake`     | Get a user's intake history            |
| PATCH  | `/api/admin/users/:id/water-goal` | `{ "dailyWaterGoal": 2500 }`           |
| DELETE | `/api/admin/users/:id`            | Delete a user and their intake records |

## Security

### Protections currently implemented

- Passwords are hashed with `bcryptjs` before storage.
- Password fields are excluded from normal user queries and responses.
- Protected routes require a signed, non-empty bearer token.
- Logout increments the user's token version, invalidating previously issued tokens for that user.
- Admin routes verify the current user's database role on every request.
- Users are restricted to their own profile and intake records.
- CORS is limited to the configured `CORS_ORIGIN` and credentials are enabled.
- MongoDB connection and JWT configuration are loaded from environment variables.

### Production checklist

- Use HTTPS and set `CORS_ORIGIN` to the exact trusted frontend origin. Do not use `*` with credentials.
- Generate a high-entropy `JWT_SECRET`, keep it outside version control, and rotate it through a planned key-management process.
- Use a least-privilege MongoDB user and a TLS-enabled MongoDB connection string. Do not expose MongoDB publicly.
- Set a strong, unique `ADMIN_PASSWORD`; do not commit `.env` or share seed credentials in tickets or chat.
- Add request rate limiting for registration and login, security headers such as Helmet, and request-size limits before exposing the service publicly.
- Add structured production logging and monitoring without recording passwords, JWTs, or sensitive personal data.
- Validate dates and request payloads at the API boundary, and review dependency updates regularly.
- Run `npm run build` in CI and deploy only the compiled output after security checks pass.

The current application does not itself provide rate limiting, Helmet security headers, or a password-reset flow. Treat those as deployment requirements for a public production API.

## Response Format

Successful responses generally contain `success: true` and return the payload in `data`. Errors contain `success: false` and a `message`. Do not expose raw internal errors or stack traces through a production deployment configuration.

## Project Structure

```text
src/
├── config/       Environment and database configuration
├── controllers/  Request handlers
├── middleware/   Authentication, admin, validation, and error handling
├── models/       Mongoose User and IntakeLog models
├── routes/       API route definitions
├── scripts/      Operational scripts such as admin seeding
└── utils/        JWT, date, and async helpers
```
