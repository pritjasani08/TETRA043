import { createProfileRoutes } from './profile.routes';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { SqlProfileRepository } from './profile.repository.sql';
import { MockProfileRepository } from './profile.repository.mock';
import { env } from '../../config/env';

const useMock = env.DATABASE_PROVIDER === 'mock';
const profileRepository = useMock ? new MockProfileRepository() : new SqlProfileRepository();
const profileService = new ProfileService(profileRepository);
const profileController = new ProfileController(profileService);
const profileRoutes = createProfileRoutes(profileController);

export { profileRoutes };
