// openmusic-api/src/controllers/userController.js
import User from '../models/user.js';
import amqp from 'amqplib';
import 'dotenv/config';

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // Buat user baru
    const user = await User.create({ name, email, password });

    // Kirim message ke queue untuk dikonsumsi consumer
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    const queue = 'send:email';

    await channel.assertQueue(queue, { durable: true });

    const message = {
      to: email,
      subject: 'Welcome to OpenMusic',
      text: `Hi ${name}, terima kasih telah mendaftar di OpenMusic!`,
      html: `<h1>Selamat datang, ${name}!</h1><p>Semoga kamu menikmati musik gratis kami.</p>`,
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    await channel.close();
    await connection.close();

    res.status(201).json({
      message: 'User registered! Email akan dikirim oleh consumer.',
      data: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed.' });
  }
}

export default { registerUser };