import 'dotenv/config';

import amqp from 'amqplib';
import config from '../utils/config.js';
import PlaylistsService from '../services/PlaylistsService.js';
import EmailService from '../services/EmailService.js';

const playlistsService = new PlaylistsService();
const emailService = new EmailService();

const init = async () => {
  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();

  const queue = 'export:playlists';
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (message) => {
    if (!message) return;

    try {
      const { playlistId, targetEmail } =
        JSON.parse(message.content.toString());

      // 🔥 FIX: jangan destructure { playlist }
      const playlist =
        await playlistsService.getPlaylistExportById(playlistId);

      const exportData = {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          songs: playlist.songs,
        },
      };

      const jsonBuffer = Buffer.from(
        JSON.stringify(exportData, null, 2)
      );

      await emailService.sendEmail(
        targetEmail,
        `Export Playlist: ${playlist.name}`,
        'Terlampir adalah hasil export playlist.',
        '<p>Terlampir adalah hasil export playlist.</p>',
        [
          {
            filename: 'playlist.json',
            content: jsonBuffer,
            contentType: 'application/json',
          },
        ]
      );

      channel.ack(message);
    } catch (error) {
      console.error('Export error:', error);
      channel.ack(message); // tetap ack supaya tidak infinite retry
    }
  });
};

init();