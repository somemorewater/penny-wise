# Penny Wise

Penny Wise is a simple finance tracker app that helps users track income and expenses in one place.  
Built with **Express.js**, it supports **basic CRUD operations**, **JWT authentication**, and **Google OAuth**.

## Features
- User authentication (Email/Password + Google Auth)
- Create, read, update, delete transactions
- Track income and expenses
- Category-based transactions
- Secure routes with JWT
- RESTful API design

## Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Google OAuth 2.0**
- **pnpm** (recommended)

## Project Structure

├── models ├── routes ├── middleware ├── config ├── server.js └── package.json

## Authentication
- **Normal Auth**: Email + password (hashed)
- **Google Auth**: OAuth login, auto-creates user if not found
- JWT used to protect private routes

## API Endpoints
### Auth
- `POST /api/signup
- `POST /api/auth/login`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`

### Transactions
- `POST /api/transactions`
- `GET /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

> All transaction routes require authentication.

## Setup & Installation
```bash
git clone https://github.com/somemorewater/penny-wise.git
cd penny-wise
pnpm install

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=your frontend u

Run the server:

pnpm start

Why Penny Wise?

Most finance apps are bloated. Penny Wise is straight to the point — track money, stay aware, move smart.

License

MIT — do whatever, just don’t be dumb.
