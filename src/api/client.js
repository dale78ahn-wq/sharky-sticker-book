const getBase = () =>
  (typeof window !== 'undefined' && window.location?.origin) ||
  process.env.REACT_APP_API_URL ||
  '';

async function request(path, options = {}) {
  const base = getBase();
  const url = `${base}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || res.statusText || '요청 실패');
  return data;
}

export async function apiLogin(name, password) {
  return request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ name: name.trim(), password }),
  });
}

export async function apiGetStudents() {
  const { students } = await request('/api/students');
  return Array.isArray(students) ? students : [];
}

export async function apiGetProgram(year, semester, userName) {
  const params = new URLSearchParams({ year, semester, userName });
  const data = await request(`/api/program?${params}`);
  return data;
}

export async function apiSetProgram(year, semester, userName, data) {
  return request('/api/program', {
    method: 'POST',
    body: JSON.stringify({ year, semester, userName, data }),
  });
}

export async function apiGetProgramAll(year, semester) {
  const params = new URLSearchParams({ year, semester, all: '1' });
  return request(`/api/program?${params}`);
}

export async function apiGetVerses(year, semester) {
  const params = new URLSearchParams({ year, semester });
  const data = await request(`/api/verses?${params}`);
  return data;
}

export async function apiSetVerses(year, semester, data) {
  return request('/api/verses', {
    method: 'POST',
    body: JSON.stringify({ year, semester, data }),
  });
}

export async function apiGetRecovery() {
  const { set, masked } = await request('/api/auth-recovery');
  return { set: !!set, masked: masked || '' };
}

export async function apiSetRecovery(code) {
  return request('/api/auth-recovery', {
    method: 'POST',
    body: JSON.stringify({ action: 'set', code }),
  });
}

export async function apiInitRecovery() {
  return request('/api/auth-recovery', {
    method: 'POST',
    body: JSON.stringify({ action: 'init' }),
  });
}

export async function apiResetPassword(recoveryCode, newPassword) {
  return request('/api/auth-recovery', {
    method: 'POST',
    body: JSON.stringify({ action: 'reset', recoveryCode, newPassword }),
  });
}
