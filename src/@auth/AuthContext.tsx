import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IUser, LoginResponse, UserResponse } from '@/types';
import { authService } from '@/services';

interface AuthContextType {
    user: IUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (updates: Partial<IUser>) => Promise<IUser | undefined>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Converter UserResponse para IUser
    const convertUserDBToUser = (userDB: UserResponse): IUser => ({
        id: String(userDB.id),
        email: userDB.email,
        displayName: userDB.name,
        role: ['user'], // Role padrão, pode ser expandido depois
        settings: {
            layout: {
                style: 'layout1',
                config: {}
            },
            customScrollbars: true,
            direction: 'ltr'
        }
    });

    // Verificar token e buscar usuário atual
    const refreshUser = async (): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('⚠️ Nenhum token encontrado para refresh');
                setUser(null);
                return;
            }

            // Buscar usuário atual da API
            const userDB = await authService.getMe();
            const user = convertUserDBToUser(userDB);
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('✅ Usuário atualizado via refreshUser');
        } catch (error) {
            console.error('❌ Erro ao buscar usuário no refreshUser:', error);

            // Verificar se é erro de autenticação (401) ou erro de rede
            const isAuthError = error && typeof error === 'object' && 'status' in error && error.status === 401;

            if (isAuthError) {
                console.log('🔑 Token inválido detectado, limpando sessão');
                setUser(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } else {
                console.warn('🌐 Erro de rede no refreshUser, mantendo sessão local');
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

                        // Verificar se o token ainda é válido (sem limpar se falhar)
                        try {
                            await authService.getMe();
                            console.log('✅ Token válido, usuário mantido');
                        } catch (error) {
                            console.warn('⚠️ Token pode estar expirado, mas mantendo sessão local:', error);
                            // Não limpar o token aqui - deixar que seja tratado nas próximas requisições
                        }
                    } catch (error) {
                        console.error('Erro ao parsear usuário armazenado:', error);
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
            console.log('🔐 Iniciando login para:', email);

            // Chamada real à API
            const response: LoginResponse = await authService.signIn({ email, password });
            console.log('✅ Login bem-sucedido, resposta recebida');

            // Armazenar token
            localStorage.setItem('token', response.token);
            console.log('💾 Token armazenado no localStorage');

            // Converter e armazenar usuário
            const user = convertUserDBToUser(response.user);
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('👤 Usuário convertido e armazenado:', { id: user.id, email: user.email, role: user.role });

        } catch (error) {
            console.error('❌ Erro no login:', error);
            throw new Error('Login falhou. Verifique suas credenciais.');
        }
    };

    const logout = async () => {
        try {
            console.log('🚪 Iniciando logout...');

            // Chamar logout na API
            await authService.signOut();
            console.log('✅ Logout na API bem-sucedido');
        } catch (error) {
            console.error('⚠️ Erro no logout da API (continuando com logout local):', error);
        } finally {
            // Limpar dados locais sempre
            console.log('🧹 Limpando dados locais...');
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.log('✅ Logout concluído');
        }
    };

    const updateUser = async (updates: Partial<IUser>): Promise<IUser | undefined> => {
        if (!user) return undefined;

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

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
