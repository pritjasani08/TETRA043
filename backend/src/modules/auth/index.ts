import { SqlAuthRepository } from './auth.repository.sql';
import { MockAuthRepository } from './auth.repository.mock';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { createAuthRoutes } from './auth.routes';
import { JwtService } from '../../core/services/JwtService';
import { PasswordService } from '../../core/services/PasswordService';
import { env } from '../../config/env';

// Module Dependency Injection
const useMock = env.DATABASE_PROVIDER === 'mock';
const authRepository = useMock ? new MockAuthRepository() : new SqlAuthRepository();
const jwtService = new JwtService();
const passwordService = new PasswordService();

const authService = new AuthService(authRepository, jwtService, passwordService);
const authController = new AuthController(authService);
const authRoutes = createAuthRoutes(authController);

export { authRoutes };
