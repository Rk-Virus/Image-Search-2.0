# Image Search 2.0

## Setup Instructions

### Create `.env` in **server/**
Refer backend/.env.example 

### Create `.env` in **client** (Vite)
Refer client/.env.example

---
## Folder Structure
project/
│
├── client/ # React (UI)
│ └── src/ # main.jsx, App.jsx (start here), index.css, etc
│ └── component/ # navbar, footer, home, login, register
│ └── utils/ # can be used to organise apis & utilities
│ └── essentials...
│
├── server/ # Node/Express API
│ ├── configs/ # DB and passport setup
│ ├── middleware/ # Passport checks
│ ├── models/ # user and search schema
│ ├── routes/ # auth and user routes
│ ├── views/ # ejs files (dummy frontend)
│ └── server.js # App entr
├── readme.md # You are here

---

# API Endpoints (Postman Reference)

## Auth Routes (`/api/auth`)

### Register User
POST /api/auth/register
Content-Type: application/json

Body:
{
"name": "John Doe",
"username": "john123",
"password": "password123"
}


### Login (Local)
POST /api/auth/login
Content-Type: application/json

Body:
{
"username": "john123",
"password": "password123"
}

### Login Success (Check Session)
GET /api/auth/login/success


### Login Failed
GET /api/auth/login/failed


### Logout
GET /api/auth/logout


### Google OAuth Login
GET /api/auth/google
Callback → /api/auth/google/redirect


### GitHub OAuth Login
GET /api/auth/github
Callback → /api/auth/github/redirect


### Facebook OAuth Login
GET /api/auth/facebook
Callback → /api/auth/facebook/redirect


---

## User Search Routes (`/api/user`)

### Add / Update Search
POST /api/user/add-search
Content-Type: application/json
Requires Auth (Session / OAuth)

Body:
{
"term": "mountains"
}


### Get Top 5 Most Frequent Searches
GET /api/user/top-searches


### Get Logged-in User Search History
GET /api/user/history
Requires Auth (Session / OAuth)
