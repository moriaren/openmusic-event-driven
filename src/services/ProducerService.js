// services/ProducerService.js
import amqp from 'amqplib';
import config from '../utils/config.js';

class ProducerService {
  static async sendMessage(queue, message) {
    const connection = await amqp.connect(config.rabbitMq.server);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  }
}

export default ProducerService;