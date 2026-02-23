import 'dotenv/config';

import app from './app.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`OpenMusic Consumer running on port ${PORT}`);
  console.log(`SMTP Host: ${process.env.SMTP_HOST}`);
});