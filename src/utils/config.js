// utils/config.js
const config = {
  app: {
    get host() {
      return process.env.HOST || 'localhost';
    },
    get port() {
      return process.env.PORT || 5000;
    },
  },

  postgres: {
    get user() {
      return process.env.PGUSER;
    },
    get password() {
      return process.env.PGPASSWORD;
    },
    get database() {
      return process.env.PGDATABASE;
    },
    get host() {
      return process.env.PGHOST;
    },
    get port() {
      return process.env.PGPORT;
    },
  },

  rabbitMq: {
    get server() {
      return process.env.RABBITMQ_SERVER;
    },
  },

  smtp: {
    get host() {
      return process.env.SMTP_HOST;
    },
    get port() {
      return Number(process.env.SMTP_PORT);
    },
    get user() {
      return process.env.SMTP_USER;
    },
    get pass() {
      return process.env.SMTP_PASSWORD;
    },
  },
};

export default config;