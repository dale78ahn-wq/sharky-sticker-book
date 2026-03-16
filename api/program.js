import { getRedis, KEY_PROGRAM, PREFIX } from './lib/redis';

function allowCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const defaultData = () => ({
  daily: {},
  weeklyAudio: {},
  weeklyDiary: {},
  weeklyBookReport: {},
  weeklyTestimony: {},
});

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const { method } = req;
  const redis = getRedis();

  try {
    if (method === 'GET') {
      const { year, semester, userName, all } = req.query;
      const y = String(year || '');
      const s = String(semester || '');

      if (all === '1' || all === 'true') {
        const pattern = `${PREFIX}program:${y}_${s}_*`;
        const keys = await redis.keys(pattern);
        const result = {};
        if (keys && keys.length > 0) {
          const values = await redis.mget(...keys);
          keys.forEach((key, i) => {
            const match = key.match(new RegExp(`program:${y}_${s}_(.+)$`));
            const userNamePart = match ? match[1] : key;
            const data = values[i] ? JSON.parse(values[i]) : defaultData();
            result[userNamePart] = { ...defaultData(), ...data };
          });
        }
        return res.status(200).json(result);
      }

      const u = String(userName || '').trim();
      if (!y || !s || !u) {
        return res.status(200).json(defaultData());
      }
      const key = KEY_PROGRAM(y, s, u);
      const raw = await redis.get(key);
      const data = raw ? JSON.parse(raw) : defaultData();
      return res.status(200).json({ ...defaultData(), ...data });
    }

    if (method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          body = {};
        }
      }
      const { year, semester, userName, data } = body || {};
      const y = String(year || '').trim();
      const s = String(semester || '').trim();
      const u = String(userName || '').trim();
      if (!y || !s || !u) {
        return res.status(400).json({ ok: false, message: 'year, semester, userName required' });
      }
      const key = KEY_PROGRAM(y, s, u);
      await redis.set(key, JSON.stringify(data || defaultData()));
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('program error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
