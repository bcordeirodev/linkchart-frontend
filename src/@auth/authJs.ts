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
// Debug das variáveis de ambiente
console.log('🔍 Google Auth Debug:', {
	clientId: process.env.GOOGLE_CLIENT_ID ? '✅ Configurado' : '❌ Não encontrado',
	clientSecret: process.env.GOOGLE_CLIENT_SECRET ? '✅ Configurado' : '❌ Não encontrado',
	nodeEnv: process.env.NODE_ENV
});

// Debug da função de login
console.log('🔍 Login function imported:', typeof login);

export const providers: Provider[] = [
	// Provedor de email e senha
	Credentials({
		id: 'credentials',
		name: 'Credentials',
		credentials: {
			email: { label: 'Email', type: 'email' },
			password: { label: 'Password', type: 'password' }
		},
		async authorize(credentials) {
			console.log('🔐 NextAuth authorize() chamado com:', {
				email: credentials?.email,
				password: '***',
				allParams: Object.keys(credentials || {})
			});

			// Validação básica
			if (!credentials?.email || !credentials?.password) {
				console.error('❌ Email ou password não fornecidos:', credentials);
				return null;
			}

			// Remoção do teste temporário - agora usando autenticação real

			try {
				console.log('📡 Chamando auth.service.signIn...');
				const data: IAuthResponse = await login({
					email: credentials.email as string,
					password: credentials.password as string
				});

				console.log('🎯 Resposta da API:', data ? '✅ Sucesso' : '❌ Sem dados');

				if (!data) {
					console.error('❌ Auth retornou dados vazios');
					return null;
				}

				const userResult = {
					id: data.user.id,
					name: data.user.name,
					email: data.user.email,
					accessToken: data.token,
					role: ['admin']
				};

				console.log('✅ Authorize bem-sucedido para:', data.user.email);
				return userResult;
			} catch (e) {
				console.error('❌ Erro no authorize:', e);
				console.error('❌ Stack trace:', e instanceof Error ? e.stack : 'N/A');
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
				token.accessToken = (user as { accessToken?: string }).accessToken;
				token.id = user.id;

				if (account?.provider === 'google' && user) {
					// Google Auth funciona independente do backend
					// O NextAuth já tem todos os dados necessários
					console.log('✅ Login Google realizado com sucesso');

					// Usar dados do Google diretamente
					token.accessToken = account.access_token; // Token do Google OAuth
					token.id = user.id;
					token.name = user.name;
					token.email = user.email;
					token.picture = user.image;
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
