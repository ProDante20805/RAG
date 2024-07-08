import { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import { setAuth } from 'utils/setAuth';
import instance from 'utils/axios';
import jwtDecode from 'jwt-decode';
import useGlobalStore from '../utils/store';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null);
  const [role, setRole] = useState('user');
  const navigate = useNavigate();
  const { _setAnswers } = useGlobalStore();

  const login = async (data) => {
    try {
      const {
        data: { token },
      } = await instance.post('/auth/login', data);
      setUser(token);
      setAuth(token);
      setRole(jwtDecode(token).role);
      _setAnswers([]);
      navigate('/', { replace: true });
      return { error: null };
    } catch (error) {
      console.log(error);
      if (error.response) {
        return { error: error.response.data.message };
      } else {
        return { error: 'Server Error' };
      }
    }
  };

  const googleLogin = async (token) => {
    setUser(token);
    setAuth(token);
    setRole(jwtDecode(token).role);
    navigate('/home', { replace: true });
  };

  const logout = () => {
    setUser(null);
    setAuth();
    navigate('/', { replace: true });
  };

  const signup = async (data) => {
    try {
      const res = await instance.post('/auth/register', data);
      console.log('token----', res.data.token);
      if (data.avatar && data.user_name) {
        const avatar_file = data.avatar;
        let formData = new FormData();
        formData.append('file', avatar_file);
        formData.append('user_name', res.data.token.id);
        await instance
          .post('/profile/updateAvatar/new', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            const result = res.data;
            console.log('avatar upload responsed-------------', result);
          })
          .catch((err) => {
            console.log('avatar upload error', err);
          });
      }
      navigate('/verifyEmail', { state: { email: res.data.token.email } });
      return { error: null };
    } catch (error) {
      console.log(error);
      return { error: error.response.data };
    }
  };

  const value = useMemo(
    () => ({
      user,
      role,
      login,
      googleLogin,
      signup,
      logout,
    }),
    [user, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
