/**
 * Layout público simplificado
 * Sem header, footer ou sistema de autenticação
 * Para páginas como login, signup, redirecionamento, etc.
 */

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
