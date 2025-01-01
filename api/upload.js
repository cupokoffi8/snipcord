const snaps = {};

export default async (req, res) => {
  if (req.method === 'POST') {
    const { image } = req.body;
    const snapId = Date.now().toString();
    snaps[snapId] = image; // Store snap temporarily
    res.status(200).json({ snapId });
  } else {
    res.status(405).send('Method Not Allowed');
  }
};