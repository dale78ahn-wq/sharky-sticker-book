import { getRedis, KEY_RECOVERY, KEY_PASSWORDS } from './lib/redis';

const ADMIN_NAMES = ['admin', '관리자'];

function allowCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const redis = getRedis();
    const { method } = req;

    if (method === 'GET') {
      const code = await redis.get(KEY_RECOVERY);
      return res.status(200).json({ set: !!code, masked: code ? code.replace(/./g, '•') : '' });
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
      const { action, code, recoveryCode, newPassword } = body || {};

      if (action === 'init') {
        const existing = await redis.get(KEY_RECOVERY);
        if (!existing || existing === '') {
          await redis.set(KEY_RECOVERY, 'damie');
          return res.status(200).json({ ok: true, message: '복구 코드가 damie로 설정되었어요.' });
        }
        return res.status(200).json({ ok: false, message: '이미 복구 코드가 설정되어 있어요.' });
      }

      if (action === 'set') {
        if (code && String(code).trim()) {
          await redis.set(KEY_RECOVERY, String(code).trim());
          return res.status(200).json({ ok: true });
        }
        return res.status(200).json({ ok: false, message: '복구 코드를 입력해주세요.' });
      }

      if (action === 'reset') {
        const stored = await redis.get(KEY_RECOVERY);
        if (!stored) return res.status(200).json({ ok: false, message: '복구 코드가 설정되어 있지 않아요.' });
        if (String(recoveryCode || '').trim() !== stored) {
          return res.status(200).json({ ok: false, message: '복구 코드가 맞지 않아요.' });
        }
        if (!newPassword || String(newPassword).length < 4) {
          return res.status(200).json({ ok: false, message: '새 비밀번호는 4자 이상 입력해주세요.' });
        }
        const rawPw = await redis.get(KEY_PASSWORDS);
        const passwords = rawPw ? JSON.parse(rawPw) : {};
        for (const adminName of ADMIN_NAMES) {
          passwords[adminName] = newPassword;
        }
        await redis.set(KEY_PASSWORDS, JSON.stringify(passwords));
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ ok: false, message: 'Invalid action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('auth-recovery error', err);
    return res.status(500).json({ ok: false, message: '서버 오류' });
  }
}
