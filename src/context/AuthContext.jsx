import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiLogin, apiGetStudents, apiGetRecovery, apiSetRecovery, apiResetPassword } from '../api/client';

const AUTH_KEY = 'shining_kids_auth';
const ADMIN_NAMES = ['admin', '관리자'];

export function isAdmin(user) {
  return user?.name && ADMIN_NAMES.includes(String(user.name).trim().toLowerCase());
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);

  const loadStudents = useCallback(async () => {
    try {
      const list = await apiGetStudents();
      setStudents(Array.isArray(list) ? list : []);
    } catch (e) {
      console.warn('Students load failed', e);
      setStudents([]);
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name) {
          setUser(parsed);
          loadStudents();
        }
      }
    } catch (e) {
      console.warn('Auth load failed', e);
    }
  }, [loadStudents]);

  const login = async (name, password) => {
    const trimmedName = String(name).trim();
    if (!trimmedName) return { ok: false, message: '이름을 입력해주세요.' };

    try {
      const result = await apiLogin(trimmedName, password);
      if (!result.ok) return result;
      const userData = { name: trimmedName, password: '***' };
      setUser(userData);
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      await loadStudents();
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message || '로그인에 실패했어요.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  const getStudentsList = () => students;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user, getStudentsList, loadStudents }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export async function getAdminRecoveryCode() {
  try {
    const { set, masked } = await apiGetRecovery();
    return set ? masked : '';
  } catch (e) {
    return '';
  }
}

export async function setAdminRecoveryCode(code) {
  try {
    if (!code || !String(code).trim()) return false;
    const result = await apiSetRecovery(String(code).trim());
    return !!result?.ok;
  } catch (e) {
    return false;
  }
}

export async function resetAdminPassword(recoveryCode, newPassword) {
  try {
    const result = await apiResetPassword(
      String(recoveryCode || '').trim(),
      String(newPassword || '')
    );
    if (result?.ok) return { ok: true };
    return { ok: false, message: result?.message || '복구에 실패했어요.' };
  } catch (err) {
    return { ok: false, message: err.message || '복구에 실패했어요.' };
  }
}
