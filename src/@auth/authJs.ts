import NextAuth from 'next-auth';
import { IUser, IUserDB, IAuthResponse } from '@/types/user';
import { createStorage } from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';
import { UnstorageAdapter } from '@auth/unstorage-adapter';
import type { NextAuthConfig } from 'next-auth';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { signIn as login } from '@/services/auth.service';
import { api } from '@/lib/api';

/**
 * Cria uma instância de armazenamento utilizando o driver de memória.
 * Para produção, considere usar um driver persistente como Redis ou banco de dados.
 */
const storage = createStorage({
	driver: memoryDriver()
});

/**
 * Definição dos provedores de autenticação.
 * Inclui autenticação por credenciais (email e senha), Google e Facebook.
 */
export const providers: Provider[] = [
	// Provedor de email e senha
	Credentials({
		name: 'Credentials',
		credentials: {
			email: { label: 'Email', type: 'email' },
			password: { label: 'Password', type: 'password' }
		},
		async authorize(formInput: { email: string; password: string }) {
			try {
				const data: IAuthResponse = await login({
					email: formInput.email,
					password: formInput.password
				});

				if (!data) {
					return null;
				}

				return {
					id: data.user.id,
					name: data.user.name,
					email: data.user.email,
					accessToken: data.token,
					role: ['admin']
				};
			} catch (e) {
				console.error('Ocorreu um erro ao efetuar o login.', e);
				return null;
			}
		}
	}),
	Google({
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET
	})
	// Facebook({
	// 	clientId: process.env.FACEBOOK_CLIENT_ID,
	// 	clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
	// }),
];

/**
 * Configuração do NextAuth.
 * Inclui temas, adaptação de armazenamento, páginas de autenticação e callbacks.
 */
const config = {
	theme: { logo: '/assets/images/logo/logo.svg' },
	adapter: UnstorageAdapter(storage),
	pages: {
		signIn: '/sign-in'
	},
	providers,
	basePath: '/auth',
	trustHost: true,
	callbacks: {
		/**
		 * Callback de autorização.
		 * Retorna `true`, permitindo a autorização de todos os usuários.
		 */
		authorized() {
			return true;
		},

		/**
		 * Callback para o JWT (JSON Web Token).
		 * Armazena o accessToken e id do usuário no token.
		 * @param param0 Objeto contendo o token, usuário, conta e gatilho
		 * @returns O token modificado com o accessToken e id do usuário.
		 */
		async jwt({ token, user, account }) {
			if (user) {
				token.accessToken = (user as any).accessToken;
				token.id = user.id;

				if (account?.provider === 'google' && user) {
					try {
						const { user: dbUser, token: apiToken } = await api.post<{ user: IUserDB; token: string }>(
							'auth/google',
							{ email: user.email, name: user.name }
						);

						token.accessToken = apiToken;
						token.id = dbUser.id;
						token.name = dbUser.name;
						token.email = dbUser.email;
					} catch (e) {
						console.error('Ocorreu um erro ao efetuar o login do google.', e);
					}
				}
			}

			return token;
		},

		/**
		 * Callback de sessão.
		 * Configura a sessão com os dados do usuário do token JWT.
		 * @param param0 Objeto contendo a sessão e o token.
		 * @returns A sessão modificada com os dados do usuário logado.
		 */
		async session({ session, token }) {
			if (token.accessToken) {
				session.accessToken = token.accessToken as string;
			}

			session.user = {
				id: token.id as string,
				name: token.name as string,
				email: token.email as string,
				image: token.picture as string,
				emailVerified: null
			};

			// Preenche a sessão com dados do token (evita chamada circular para /api/me)
			session.db = {
				id: token.id as string,
				role: ['admin'],
				displayName: token.name as string,
				photoURL: token.picture || 'https://picsum.photos/200',
				email: token.email as string
			} as IUser;

			return session;
		}
	},
	experimental: {
		enableWebAuthn: true
	},
	session: {
		strategy: 'jwt',

		/*
		 * Expiração da sessão para 30 dias
		 */
		maxAge: 30 * 24 * 60 * 60
	},
	debug: process.env.NODE_ENV !== 'production'
} satisfies NextAuthConfig;

/**
 * Tipo personalizado para os provedores de autenticação.
 * Define o formato de dados dos provedores.
 */
export type AuthJsProvider = {
	id: string;
	name: string;
	style?: {
		text?: string;
		bg?: string;
	};
};

/**
 * Mapeia os provedores de autenticação, removendo o provedor de credenciais.
 * Retorna um array de objetos com dados dos provedores.
 */
export const authJsProviderMap: AuthJsProvider[] = providers
	.map((provider) => {
		const providerData = typeof provider === 'function' ? provider() : provider;

		return {
			id: providerData.id,
			name: providerData.name,
			style: {
				text: (providerData as { style?: { text: string } }).style?.text,
				bg: (providerData as { style?: { bg: string } }).style?.bg
			}
		};
	})
	.filter((provider) => provider.id !== 'credentials'); // Filtra para remover o provedor de credenciais

/**
 * Exporta os manipuladores do NextAuth.
 * Inclui funções de autenticação e logout.
 */
export const { handlers, auth, signIn, signOut } = NextAuth(config);
