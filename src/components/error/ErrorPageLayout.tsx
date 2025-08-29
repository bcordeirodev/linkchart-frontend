'use client';

import { Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import Link from '@fuse/core/Link';

interface ErrorPageLayoutProps {
	errorCode: string;
	title: string;
	subtitle: string;
	illustration?: React.ReactNode;
	actions?: React.ReactNode;
	children?: React.ReactNode;
}

/**
 * Layout padrão para páginas de erro
 * Padroniza a apresentação de erros 401, 404, etc.
 */
export function ErrorPageLayout({ errorCode, title, subtitle, illustration, actions, children }: ErrorPageLayoutProps) {
	return (
		<div className="flex flex-1 flex-col items-center justify-center p-4">
			<div className="w-full max-w-5xl text-center">
				{/* Ilustração */}
				{illustration && (
					<motion.div
						initial={{ opacity: 0, scale: 0.6 }}
						animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
					>
						{illustration}
					</motion.div>
				)}

				{/* Título Principal */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
				>
					<Typography
						variant="h1"
						className="mt-12 text-center text-4xl font-extrabold leading-[1.25] tracking-tight sm:mt-24 md:text-7xl md:leading-none"
					>
						{title}
					</Typography>
				</motion.div>

				{/* Subtítulo */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
				>
					<Typography
						variant="h5"
						color="text.secondary"
						className="mt-2 text-center text-lg font-medium tracking-tight md:text-xl"
					>
						{subtitle}
					</Typography>
				</motion.div>

				{/* Conteúdo Adicional */}
				{children && (
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
					>
						{children}
					</motion.div>
				)}

				{/* Ações */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
					className="mt-8 flex flex-col items-center gap-4"
				>
					{actions || (
						<div className="flex gap-4">
							<Link to="/">
								<Button
									variant="contained"
									className="min-w-[120px]"
								>
									Ir para Home
								</Button>
							</Link>
							<Button
								variant="outlined"
								onClick={() => window.history.back()}
							>
								Voltar
							</Button>
						</div>
					)}
				</motion.div>
			</div>
		</div>
	);
}

export default ErrorPageLayout;
