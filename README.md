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
- Publish export request to RabbitMQ
- Consumer processes export request
- Playlist exported as JSON file
- JSON sent via email attachment

---

## 🏗 Architecture Overview

Client → REST API → PostgreSQL  
Export Request → RabbitMQ → Consumer → Email Service  

This project implements asynchronous processing using message queue to avoid blocking main request-response cycle.

---

## 📂 Project Structure

src/
├── api/
├── services/
├── validator/
├── exceptions/
├── utils/
├── consumer.js
└── server.js


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
- Role-based access control
- Event-driven architecture
- Integration between services (API ↔ Message Broker ↔ Email)
- Clean modular structure

---

## ⚙️ Installation

npm install

Create .env file:
HOST=localhost
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=openmusic

RABBITMQ_SERVER=amqp://localhost

SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_email
SMTP_PASS=your_password

Run server:
npm run start

Run consumer:
node src/consumer.js

---
