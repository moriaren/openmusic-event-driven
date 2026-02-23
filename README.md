# 🎵 OpenMusic API – Event-Driven Playlist Service

OpenMusic is a RESTful API for managing music playlists.  
This project demonstrates backend development skills including:

- CRUD operations with PostgreSQL
- Authentication & Authorization
- Message Queue integration (RabbitMQ)
- Asynchronous playlist export
- Sending JSON file attachment via email

---

## 🚀 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Redis
- RabbitMQ (AMQP)
- Nodemailer
- JWT Authentication

---

## 📦 Features

### ✅ Playlist Management
- Create playlist
- Add & remove songs
- Get playlist detail
- Activity logging

### ✅ Authentication & Authorization
- JWT-based authentication
- Playlist ownership & collaboration support

### ✅ Asynchronous Export (Event-Driven)
- Redis caching for export requests
- Publish export request to RabbitMQ
- Consumer processes export request
- Playlist exported as JSON file
- JSON sent via email attachment

---

## 🏗 Architecture Overview

Client → REST API → PostgreSQL  
Export Request → RabbitMQ → Consumer → Email Service
<br>Redis Caching for export requests

This project implements asynchronous processing using message queue to avoid blocking main request-response cycle.

---

## 📂 Project Structure
```
src/
├── api/
├── services/
├── validator/
├── exceptions/
├── utils/
├── consumer.js
└── server.js
```

---

## 📨 JSON Export Format

Exported file format:

```json
{
  "playlist": {
    "id": "playlist-xxxx",
    "name": "Playlist Name",
    "songs": [
      {
        "id": "song-xxxx",
        "title": "Song Title",
        "performer": "Artist Name"
      }
    ]
  }
}
```
---

## 🧠 What This Project Demonstrates

- Designing RESTful APIs
- Database relationship handling
- Role-based access control & collaboration
- Event-driven architecture
- Integration between services (API ↔ Message Broker ↔ Email)
- Redis caching for performance
- Clean modular structure

---

## ⚙️ Installation
```
npm install
```
Create .env file:
```
# Server
HOST=localhost
PORT=5000

# PostgreSQL
PGHOST=localhost
PGPORT=5432
PGUSER=your_user
PGPASSWORD=your_password
PGDATABASE=openmusic

# Redis
REDIS_SERVER=localhost
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_SERVER=amqp://localhost

# SMTP (for email export)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password

# JWT
ACCESS_TOKEN_KEY=your_access_token_key
REFRESH_TOKEN_KEY=your_refresh_token_key
ACCESS_TOKEN_AGE=1800s
REFRESH_TOKEN_AGE=7d
```
Run server:
```
npm run start
```
Run consumer:
```
node src/consumer.js
```
---

## 🎉 Credits

Special thanks to IDCamp 2025 and Dicoding for guidance and learning resources.

---

