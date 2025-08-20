import { IUser } from '@/user';

declare module 'next-auth' {
	interface Session {
		accessToken?: string;
		db: IUser;
	}
	interface JWT {
		accessToken?: string;
	}
}
