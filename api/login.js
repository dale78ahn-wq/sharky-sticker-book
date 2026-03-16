import { getRedis, KEY_STUDENTS, KEY_PASSWORDS } from './lib/redis';

const ADMIN_NAMES = ['admin', '관리자'];

function allowCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseJson(raw, fallback) {
  if (raw == null || raw === '') return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed != null ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
}

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  try {
    const redis = getRedis();
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    const { name, password } = body || {};
    const trimmedName = String(name || '').trim();
    const trimmedPassword = String(password ?? '').trim();
    if (!trimmedName) {
      return res.status(200).json({ ok: false, message: '이름을 입력해주세요.' });
    }

    const rawPasswords = await redis.get(KEY_PASSWORDS);
    const passwords = parseJson(rawPasswords, {});

    const isAdmin = ADMIN_NAMES.includes(trimmedName.toLowerCase());
    const storedPassword = passwords[trimmedName] != null ? String(passwords[trimmedName]).trim() : null;

    if (storedPassword !== null) {
      if (trimmedPassword !== storedPassword) {
        return res.status(200).json({ ok: false, message: '비밀번호가 맞지 않아요.' });
      }
    } else {
      if (!trimmedPassword) {
        return res.status(200).json({ ok: false, message: '첫 로그인은 비밀번호를 설정해주세요.' });
      }
      passwords[trimmedName] = trimmedPassword;
      if (isAdmin) {
        for (const adminName of ADMIN_NAMES) {
          passwords[adminName] = trimmedPassword;
        }
      }
      await redis.set(KEY_PASSWORDS, JSON.stringify(passwords));
    }

    const rawStudents = await redis.get(KEY_STUDENTS);
    const students = parseJson(rawStudents, []);
    if (!Array.isArray(students)) {
      await redis.set(KEY_STUDENTS, JSON.stringify([]));
    } else if (!students.includes(trimmedName) && !isAdmin) {
      await redis.set(KEY_STUDENTS, JSON.stringify([...students, trimmedName]));
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('login error', err);
    const message = err.message === 'Redis not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.'
      ? '서버 설정이 안 되어 있어요. (Redis 연동 확인)'
      : '서버 오류가 났어요.';
    return res.status(500).json({ ok: false, message });
  }
}
