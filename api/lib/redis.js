import { Redis } from '@upstash/redis';

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export const PREFIX = 'shining_kids:';
export const KEY_STUDENTS = `${PREFIX}students`;
export const KEY_PASSWORDS = `${PREFIX}passwords`;
export const KEY_RECOVERY = `${PREFIX}recovery`;
export const KEY_PROGRAM = (y, s, u) => `${PREFIX}program:${y}_${s}_${u}`;
export const KEY_VERSES = (y, s) => `${PREFIX}verses:${y}_${s}`;

export function getRedis() {
  if (!redis) throw new Error('Redis not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.');
  return redis;
}

export function jsonResponse(data, status = 200) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify(data),
  };
}
