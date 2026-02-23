# 🎵 OpenMusic API – Version 3 (Event-Driven & Caching)

OpenMusic API Version 3 is the final evolution of the OpenMusic backend.

This version introduces:
- Server-side caching with Redis
- Asynchronous export using RabbitMQ (Message Broker)
- File handling (local storage & static file serving)
- Album cover upload
- Event-driven architecture for scalability

---

## 🚀 Project Overview

Since the release of OpenMusic Version 2, the platform has experienced massive growth.  
The playlist feature significantly improved user experience and increased adoption.

However, as traffic increased, the database server began experiencing heavy load—especially from repeated playlist queries.

To solve scalability issues and introduce new user-requested features, Version 3 implements:

- Server-side caching (Redis)
- Playlist export feature (asynchronous)
- Album cover image upload
- Message broker integration (RabbitMQ)

---

## 🧩 Problem Statement

With thousands of active users:

- Database frequently became overloaded
- Playlist queries were repeatedly executed
- Export requests could block the main request-response cycle
- Users wanted to:
  - Export playlist songs
  - Upload album cover images

The backend needed to be more scalable, efficient, and resilient.

---

## 🛠️ Solution

OpenMusic API Version 3 introduces:

### 🔁 Server-Side Caching
- Redis used to cache playlist data
- Reduce database load
- Improve response time
- Cache invalidation on data changes

### 📨 Event-Driven Export
- Export requests are published to RabbitMQ
- Consumer processes export in background
- Playlist exported as JSON
- JSON file sent via email attachment
- Prevents blocking API responses

### 🖼️ Album Cover Upload
- File upload handling
- Local storage implementation
- Static file serving
- Extensible for Amazon S3 integration

---

## ✨ Features

### 🎼 Albums
- CRUD album
- Upload album cover image
- Serve album cover as static file

### 🎵 Songs
- CRUD songs
- Filtering support

### 👤 Users
- Register
- Login
- JWT authentication

### 🔐 Authentication & Authorization
- Token-based authentication (JWT)
- Private playlist protection
- Playlist ownership validation
- Collaboration support

### 📂 Playlists
- Create private playlist
- Add & remove songs
- Retrieve playlist with relational JOIN
- Activity logging
- Cached playlist retrieval

### 📤 Playlist Export (Asynchronous)
- Publish export request to RabbitMQ
- Background consumer processes job
- Generate JSON file
- Send via email

---

## 🧱 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Redis (Server-side caching)
- RabbitMQ (Message Broker)
- Nodemailer
- JWT
- node-pg-migrate
- Joi
- dotenv

---

## 🏗 Architecture Overview
```
Client → REST API (Express)  
  ↳ PostgreSQL (Primary Data Store)  
  ↳ Redis (Caching Layer)  
  ↳ RabbitMQ (Message Broker)  
    ↳ Consumer Service → Email Service  
```
This architecture ensures:

- Reduced database workload
- Non-blocking export processing
- Improved scalability
- Better separation of concerns

---

## 📂 Project Structure

```
src/
├── api/
├── services/
├── validator/
├── exceptions/
├── consumer/
├── utils/
├── uploads/
├── server.js
└── app.js
```

---

## 📨 Export JSON Format

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

## ⚙️ Installation

Install dependencies:
```
npm install
```
Create .env file:
```
HOST=localhost
PORT=5000

PGHOST=localhost
PGPORT=5432
PGUSER=your_user
PGPASSWORD=your_password
PGDATABASE=openmusic

REDIS_SERVER=localhost
REDIS_PORT=6379

RABBITMQ_SERVER=amqp://localhost

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password

ACCESS_TOKEN_KEY=your_access_token_key
REFRESH_TOKEN_KEY=your_refresh_token_key
ACCESS_TOKEN_AGE=1800
REFRESH_TOKEN_AGE=604800
```
Run migration:
```
npm run migrate up
```
Start API server:
```
npm run start
```
Run consumer:
```
node src/consumer/consumer.js
```

---

## 🧠 What This Project Demonstrates

- Implementing Message Broker (RabbitMQ)
- Applying Event-Driven Architecture
- Implementing Server-Side Caching with Redis
- Handling file uploads & static file serving
- Designing scalable RESTful APIs
- Managing relational data with SQL JOIN
- Clean layered backend architecture
- Separation between API & background worker

---

## 🔄 Version Evolution

Version 1
- Albums & Songs CRUD

Version 2
- Authentication & Authorization
- Private Playlists
- Database Normalization

Version 3
- Redis Caching
- Event-Driven Export
- RabbitMQ Integration
- File Upload & Static File Handling
- Improved Scalability

---

## 🎓 Learning Context

This project concludes the OpenMusic backend journey covering:
- Message Broker concepts
- RabbitMQ implementation
- File handling (local & static)
- Amazon S3 storage concept
- Server-side caching with Redis

---

## 🎉 Credits

Special thanks to IDCamp 2025 and Dicoding for guidance and learning resources.

---
