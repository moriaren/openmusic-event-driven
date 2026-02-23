import PlaylistsService from '../../services/PlaylistsService.js';
import amqp from 'amqplib';
import 'dotenv/config';

class ExportsController {
  static async exportPlaylist(req, res) {
    try {
      const { playlistId } = req.params;
      const { targetEmail } = req.body;
      const userId = req.user.id;

      // Cek hak akses → hanya pemilik playlist yang boleh ekspor
      await PlaylistsService.verifyPlaylistOwner(playlistId, userId);

      // Kirim pesan ke RabbitMQ
      const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
      const channel = await connection.createChannel();
      const queue = 'export:playlists';

      await channel.assertQueue(queue, { durable: true });

      const message = { playlistId, targetEmail };
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });

      await channel.close();
      await connection.close();

      // Response ke client
      return res.status(201).json({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: 'fail', message: err.message });
    }
  }
}

export default ExportsController;