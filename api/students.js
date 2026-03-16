import { getRedis, KEY_STUDENTS } from './lib/redis';

function allowCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const redis = getRedis();
    const raw = await redis.get(KEY_STUDENTS);
    const students = raw ? JSON.parse(raw) : [];
    return res.status(200).json({ students });
  } catch (err) {
    console.error('students error', err);
    return res.status(500).json({ students: [] });
  }
}
