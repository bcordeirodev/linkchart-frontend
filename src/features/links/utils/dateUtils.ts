/**
 * 📅 UTILITÁRIOS DE DATA PARA LINKS
 * Funções auxiliares para manipulação de datas nos formulários de links
 */

/**
 * Converte uma string de data em objeto Date válido ou null
 * @param dateString - String da data a ser convertida
 * @returns Date válido ou null se inválido
 */
export function parseValidDate(dateString: string | null | undefined): Date | null {
    if (!dateString) return null;

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
}

/**
 * Converte Date para formato compatível com Laravel (YYYY-MM-DD HH:MM:SS)
 * @param date - Objeto Date a ser convertido
 * @returns String formatada ou null se data inválida
 */
export function formatDateForLaravel(date: Date | null | undefined): string | null {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return null;
    }

    return date.toISOString().replace('T', ' ').substring(0, 19);
}

/**
 * Valida se uma data é válida
 * @param date - Date a ser validado
 * @returns true se válido, false caso contrário
 */
export function isValidDate(date: any): date is Date {
    return date instanceof Date && !isNaN(date.getTime());
}
