/**
 * Sistema para redirecionar logs do browser para o terminal via WebSocket
 * Útil para desenvolvimento quando queremos ver logs da aplicação no terminal
 */

export class TerminalLogger {
	private static instance: TerminalLogger;
	private ws: WebSocket | null = null;
	private originalConsole: {
		log: typeof console.log;
		error: typeof console.error;
		warn: typeof console.warn;
		info: typeof console.info;
	};

	constructor() {
		this.originalConsole = {
			log: console.log.bind(console),
			error: console.error.bind(console),
			warn: console.warn.bind(console),
			info: console.info.bind(console)
		};
	}

	static getInstance(): TerminalLogger {
		if (!TerminalLogger.instance) {
			TerminalLogger.instance = new TerminalLogger();
		}

		return TerminalLogger.instance;
	}

	setupConsoleForwarding(): void {
		if (typeof window === 'undefined') return;

		// Interceptar console.log e enviar para terminal
		console.log = (...args: any[]) => {
			this.originalConsole.log(...args);
			this.sendToTerminal('LOG', args);
		};

		console.error = (...args: any[]) => {
			this.originalConsole.error(...args);
			this.sendToTerminal('ERROR', args);
		};

		console.warn = (...args: any[]) => {
			this.originalConsole.warn(...args);
			this.sendToTerminal('WARN', args);
		};

		console.info = (...args: any[]) => {
			this.originalConsole.info(...args);
			this.sendToTerminal('INFO', args);
		};
	}

	private sendToTerminal(level: string, args: any[]): void {
		// Por enquanto, apenas formatamos melhor no console do browser
		const timestamp = new Date().toLocaleTimeString();
		const message = args
			.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
			.join(' ');

		// Formatação colorida para diferentes níveis
		const colors = {
			LOG: '\x1b[36m', // Cyan
			ERROR: '\x1b[31m', // Red
			WARN: '\x1b[33m', // Yellow
			INFO: '\x1b[32m' // Green
		};

		const reset = '\x1b[0m';
		const color = colors[level as keyof typeof colors] || '';

		// Se tivéssemos WebSocket, enviaríamos aqui
		// Por agora, melhoramos a visibilidade no console
		this.originalConsole.log(`${color}[${timestamp}] ${level}:${reset}`, message);
	}

	restoreConsole(): void {
		console.log = this.originalConsole.log;
		console.error = this.originalConsole.error;
		console.warn = this.originalConsole.warn;
		console.info = this.originalConsole.info;
	}
}

// Configurar automaticamente em desenvolvimento
if (import.meta.env.DEV) {
	const logger = TerminalLogger.getInstance();
	// logger.setupConsoleForwarding(); // Descomentado quando necessário
}

export default TerminalLogger;
