import { redirect } from 'next/navigation';

/**
 * Página principal do control panel - redireciona para o dashboard
 */
export default function ControlPanelPage() {
	redirect('/analytics');
}
