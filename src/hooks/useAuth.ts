import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setUser, clearUser } from '@/store/slices/authSlice';
import { authService } from '@/services/authService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    try {
      const userData = await authService.login(email, password);
      dispatch(setUser(userData.user));
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch(clearUser());
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const userData = await authService.register(username, email, password);
      dispatch(setUser(userData.user));
      return userData;
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    login,
    logout,
    register,
  };
};
