import { User } from '../../../types';

export const MOCK_USER = {
  email: 'user@test.com',
  password: '123456',
  profile: {
    id: 'u_101',
    name: 'Alex Morgan',
    email: 'user@test.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    role: 'Premium Shopper',
  } as User,
};
