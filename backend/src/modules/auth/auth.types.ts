import { User } from '../../core/interfaces';

export interface SignupDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  user: Omit<User, 'password'>;
}
