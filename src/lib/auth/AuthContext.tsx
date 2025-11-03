import { createContext, useContext, useEffect, useState } from 'react';

import { authService } from '@/services';

import type { LoginResponse, User, UserResponse } from '@/types';
import type { ReactNode } from 'react';

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	updateUser: (updates: Partial<User>) => Promise<User | undefined>;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Converter UserResponse para User
	const convertUserDBToUser = (userDB: UserResponse): User => ({
		id: String(userDB.id),
		name: userDB.name || userDB.email, // Usar name ou email como fallback
		email: userDB.email,
		displayName: userDB.name,
		role: ['user'], // Role padrão, pode ser expandido depois
		settings: {
			layout: {
				style: 'layout1',
				config: {}
			},
			direction: 'ltr'
		}
	});

	// Verificar token e buscar usuário atual
	const refreshUser = async (): Promise<void> => {
		try {
			const token = localStorage.getItem('token');

			if (!token) {
				setUser(null);
				return;
			}

			// Buscar usuário atual da API
			const userDB = await authService.getMe();
			const user = convertUserDBToUser(userDB);
			setUser(user);
			localStorage.setItem('user', JSON.stringify(user));
			// Usuário atualizado
		} catch (error) {
			// Erro no refresh tratado

			// Verificar se é erro de autenticação (401) ou erro de rede
			const isAuthError = error && typeof error === 'object' && 'status' in error && error.status === 401;

			if (isAuthError) {
				// Token inválido detectado, limpando sessão
				setUser(null);
				localStorage.removeItem('token');
				localStorage.removeItem('user');
			} else {
				// Erro de rede no refreshUser, mantendo sessão local
				// Não limpar dados se for erro de rede
			}
		}
	};

	useEffect(() => {
		const initializeAuth = async () => {
			try {
				// Verificar se há token e usuário armazenado
				const token = localStorage.getItem('token');
				const storedUser = localStorage.getItem('user');

				if (token && storedUser) {
					try {
						const user = JSON.parse(storedUser);
						setUser(user);

						// Verificar se o token ainda é válido
						try {
							await authService.getMe();
							// Token válido
						} catch (error) {
							// Token expirado ou inválido - limpar dados locais
							console.warn('Token expirado ou inválido detectado durante inicialização, limpando dados locais');
							localStorage.removeItem('token');
							localStorage.removeItem('user');
							setUser(null);
						}
					} catch (error) {
						// Erro ao parsear usuário
						localStorage.removeItem('user');
						localStorage.removeItem('token');
						setUser(null);
					}
				} else {
					setUser(null);
				}
			} catch (error) {
				console.error('Erro na inicialização da auth:', error);
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		initializeAuth();
	}, []);

	const login = async (email: string, password: string): Promise<void> => {
		try {
			// Iniciando login

			// Chamada real à API
			const response: LoginResponse = await authService.signIn({ email, password });
			// Login bem-sucedido

			// Armazenar token
			localStorage.setItem('token', response.token);
			// Token armazenado

			// Converter e armazenar usuário
			const user = convertUserDBToUser(response.user);
			setUser(user);
			localStorage.setItem('user', JSON.stringify(user));
			// Usuário armazenado
		} catch (error) {
			// Erro no login tratado
			throw new Error('Login falhou. Verifique suas credenciais.');
		}
	};

	const logout = async () => {
		try {
			// Iniciando logout

			// Chamar logout na API
			await authService.signOut();
			// Logout na API bem-sucedido
		} catch (error) {
			// Erro no logout da API (continuando com logout local)
		} finally {
			// Limpar dados locais sempre
			setUser(null);
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			// Logout concluído
		}
	};

	const updateUser = async (updates: Partial<User>): Promise<User | undefined> => {
		if (!user) {
			return undefined;
		}

		try {
			// Atualizar usuário na API
			const updatedUserDB = await authService.updateProfile({
				name: updates.displayName || user.displayName,
				email: updates.email || user.email
			});
			const updatedUser = convertUserDBToUser(updatedUserDB);

			setUser(updatedUser);
			localStorage.setItem('user', JSON.stringify(updatedUser));
			return updatedUser;
		} catch (error) {
			console.error('Erro ao atualizar usuário:', error);
			throw new Error('Falha ao atualizar perfil');
		}
	};

	const value = {
		user,
		isAuthenticated: !!user,
		isLoading,
		login,
		logout,
		updateUser,
		refreshUser
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
}
