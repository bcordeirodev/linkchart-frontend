/**
 * Destino pós-login (`returnTo`) — validação compartilhada entre quem escreve
 * o parâmetro (`middleware.ts`, ao barrar um guest numa rota protegida) e quem
 * o lê (`SignInPage`, ao repassá-lo para `/auth/login`).
 *
 * O valor viaja na query string, ou seja, é entrada controlada pelo usuário: um
 * `returnTo=https://evil.com` transformaria a tela de login num open redirect
 * com a credibilidade do nosso domínio. Por isso só caminhos internos passam, e
 * a checagem é feita nas duas pontas — o SDK do Auth0 também sanitiza, mas a
 * garantia não é delegada a ele.
 */

/**
 * Caminho interno de barra única.
 *
 * A barra dupla (`//evil.com`) é uma URL protocol-relative e sairia do domínio;
 * a contrabarra (`/\evil.com`) é normalizada para `//` por vários navegadores e
 * teria o mesmo efeito. Ambas são rejeitadas.
 */
const SAFE_RETURN_TO_PATTERN = /^\/(?![/\\])/;

/**
 * Teto de tamanho. Um destino legítimo é um path com alguns filtros
 * (`/links/analytics/123?period=7d&tab=overview`); qualquer coisa muito acima
 * disso é ruído ou tentativa de estourar buffer de header.
 */
const MAX_RETURN_TO_LENGTH = 512;

/**
 * Verifica se um valor pode ser usado como destino pós-login.
 *
 * @param value - candidato lido da query string (ou montado pelo middleware).
 * @returns `true` apenas para caminhos internos de barra única dentro do limite
 *   de tamanho.
 */
export function isSafeReturnTo(
  value: string | null | undefined,
): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= MAX_RETURN_TO_LENGTH &&
    SAFE_RETURN_TO_PATTERN.test(value)
  );
}

/**
 * Normaliza um `returnTo` para uso direto, trocando qualquer valor inseguro ou
 * ausente pelo fallback.
 *
 * @param value - candidato lido da query string.
 * @param fallback - destino usado quando `value` não passa em
 *   {@link isSafeReturnTo}. O padrão `/` é a home autenticada.
 * @returns um caminho interno seguro.
 */
export function sanitizeReturnTo(
  value: string | null | undefined,
  fallback = "/",
): string {
  return isSafeReturnTo(value) ? value : fallback;
}
