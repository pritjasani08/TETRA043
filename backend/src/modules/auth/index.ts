import { MockAuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { createAuthRoutes } from './auth.routes';
import { JwtService } from '../../core/services/JwtService';
import { PasswordService } from '../../core/services/PasswordService';

// Module Dependency Injection
const authRepository = new MockAuthRepository();
const jwtService = new JwtService();
const passwordService = new PasswordService();

const authService = new AuthService(authRepository, jwtService, passwordService);
const authController = new AuthController(authService);
const authRoutes = createAuthRoutes(authController);

export { authRoutes };
