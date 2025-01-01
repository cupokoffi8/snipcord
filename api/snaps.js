export default async (req, res) => {
    const { id } = req.query;
    const snap = snaps[id];
    if (snap) {
      delete snaps[id]; // Delete snap after it's viewed
      res.send(`
        <html>
        <body style="margin: 0; background: black;">
          <img src="${snap}" style="width: 100vw; height: 100vh; object-fit: contain;" />
        </body>
        </html>
      `);
    } else {
      res.status(404).send('Snap not found or already viewed.');
    }
  };  