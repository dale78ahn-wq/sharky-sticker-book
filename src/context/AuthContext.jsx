import { createContext, useContext, useState, useEffect } from 'react';

const AUTH_KEY = 'shining_kids_auth';
const STUDENTS_KEY = 'shining_kids_students';
const PASSWORDS_KEY = 'shining_kids_user_passwords';
const ADMIN_RECOVERY_KEY = 'sharky_admin_recovery';
const ADMIN_NAMES = ['admin', '관리자'];

export function isAdmin(user) {
  return user?.name && ADMIN_NAMES.includes(String(user.name).trim().toLowerCase());
}

export function getStudentsList() {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Students list load failed', e);
  }
  return [];
}

function getPasswords() {
  try {
    const raw = localStorage.getItem(PASSWORDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Passwords load failed', e);
  }
  return {};
}

function setStoredPassword(name, password) {
  const pw = getPasswords();
  pw[name] = password;
  try {
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(pw));
  } catch (e) {
    console.warn('Password save failed', e);
  }
}

function getStoredPassword(name) {
  return getPasswords()[name] ?? null;
}

export function getAdminRecoveryCode() {
  try {
    return localStorage.getItem(ADMIN_RECOVERY_KEY) || '';
  } catch (e) {
    return '';
  }
}

export function setAdminRecoveryCode(code) {
  try {
    if (code && code.trim()) {
      localStorage.setItem(ADMIN_RECOVERY_KEY, code.trim());
      return true;
    }
  } catch (e) {
    console.warn('Recovery code save failed', e);
  }
  return false;
}

export function resetAdminPassword(recoveryCode, newPassword) {
  const stored = getAdminRecoveryCode();
  if (!stored) return { ok: false, message: '복구 코드가 설정되어 있지 않아요.' };
  if (recoveryCode.trim() !== stored) return { ok: false, message: '복구 코드가 맞지 않아요.' };
  if (!newPassword || newPassword.length < 4)
    return { ok: false, message: '새 비밀번호는 4자 이상 입력해주세요.' };

  for (const adminName of ADMIN_NAMES) {
    setStoredPassword(adminName, newPassword);
  }
  return { ok: true };
}

function registerStudent(name) {
  if (!name || ADMIN_NAMES.includes(String(name).trim().toLowerCase())) return;
  const list = getStudentsList();
  if (list.includes(name)) return;
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify([...list, name]));
  } catch (e) {
    console.warn('Register student failed', e);
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name) setUser(parsed);
      }
    } catch (e) {
      console.warn('Auth load failed', e);
    }
  }, []);

  const login = (name, password) => {
    const trimmedName = String(name).trim();
    if (!trimmedName) return { ok: false, message: '이름을 입력해주세요.' };

    const storedPw = getStoredPassword(trimmedName);
    if (storedPw !== null) {
      if (password !== storedPw) return { ok: false, message: '비밀번호가 맞지 않아요.' };
    } else {
      if (!password || !password.trim()) return { ok: false, message: '첫 로그인은 비밀번호를 설정해주세요.' };
      setStoredPassword(trimmedName, password);
    }

    const userData = { name: trimmedName, password: '***' };
    setUser(userData);
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    registerStudent(trimmedName);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
