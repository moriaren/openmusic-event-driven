🎵 OpenMusic Event-Driven Backend
Event-driven backend implementation of OpenMusic using RabbitMQ for asynchronous playlist export and email delivery.

🚀 Features
- JWT Authentication
- PostgreSQL Database
- Redis Caching
- Playlist Collaboration
- Playlist Activity Logging
- RabbitMQ Event-Driven Architecture
- Email Export with JSON Attachment
- Clean Configuration Management

🏗 Architecture Overview
Client → REST API → PostgreSQL
                  ↓
              RabbitMQ
                  ↓
              Consumer Service
                  ↓
              Email Service
This project separates responsibilities between API and consumer service to simulate real-world distributed system design.

🛠 Tech Stack
- Node.js
- Express.js
- PostgreSQL
- Redis
- RabbitMQ
- Nodemailer
- JWT

⚙️ Setup
1. Clone repository
2. Copy .env.example → .env
3. Install dependencies
npm install
4. Run API
npm run start
5. Run Consumer
node src/consumer/consumer.js

📌 Why Event-Driven?
This implementation demonstrates:
- Asynchronous processing
- Service separation
- Message queue integration
- Scalable architecture principles
