import { redirect } from 'next/navigation';

/**
 * Página principal do control panel - redireciona para o dashboard
 */
function ControlPanelPage() {
	redirect('/analytics');
	return null;
}

export default ControlPanelPage;
