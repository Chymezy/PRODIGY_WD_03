import { User, IUser } from './User';

export const createUser = async (username: string, email: string, password: string): Promise<IUser> => {
  const user = new User({
    username,
    email,
    passwordHash: password
  });
  return user.save();
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email });
};

export const validatePassword = async (user: IUser, password: string): Promise<boolean> => {
  return user.comparePassword(password);
};
