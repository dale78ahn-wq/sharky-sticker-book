import { getRedis, KEY_VERSES } from './lib/redis';

function allowCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const defaultVerses = () => ({
  '1': [],
  '2': [],
  '3': [],
  '4': [],
  '5': [],
  '6': [],
  '7': [],
});

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const redis = getRedis();
    const { method } = req;

    if (method === 'GET') {
      const { year, semester } = req.query;
      const y = String(year || '');
      const s = String(semester || '');
      if (!y || !s) return res.status(200).json(defaultVerses());
      const key = KEY_VERSES(y, s);
      const raw = await redis.get(key);
      const data = raw ? JSON.parse(raw) : defaultVerses();
      return res.status(200).json({ ...defaultVerses(), ...data });
    }

    if (method === 'POST') {
      const { year, semester, data } = req.body || {};
      const y = String(year || '').trim();
      const s = String(semester || '').trim();
      if (!y || !s) return res.status(400).json({ ok: false });
      const key = KEY_VERSES(y, s);
      await redis.set(key, JSON.stringify(data || defaultVerses()));
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('verses error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
