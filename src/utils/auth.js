export const getAuthConfig = () => {
  const token = localStorage.getItem('token');

  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true,
  };
};

export const hasToken = () => Boolean(localStorage.getItem('token'));

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

export const getUserScopedKey = (prefix = 'cards') => {
  const user = getCurrentUser();
  const userKey = user?._id || user?.id || user?.email || 'guest';
  return `${prefix}:${userKey}`;
};
