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
