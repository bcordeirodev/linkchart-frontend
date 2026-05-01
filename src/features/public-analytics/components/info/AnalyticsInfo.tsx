"use client";
import { useNavigate } from "react-router-dom";

import { UpgradeCTA } from "@/features/shorter";
import { EnhancedPaper } from "@/shared/ui/base";

import type { PublicAnalyticsData, PublicAnalyticsActions } from "../../types";

interface AnalyticsInfoProps {
  analyticsData: PublicAnalyticsData;
  actions: PublicAnalyticsActions;
}

/**
 * 📈 INFORMAÇÕES SOBRE ANALYTICS
 *
 * Componente que explica os recursos de analytics e oferece CTAs
 * Segue padrões de design e UX do projeto
 */
export function AnalyticsInfo({ actions }: AnalyticsInfoProps) {
  const navigate = useNavigate();
  const { handleCreateLink } = actions;

  return (
    <EnhancedPaper variant="glass" sx={{ mt: 0 }}>
      {/* <CardContent>
				<Typography
					variant="h6"
					gutterBottom
				>
					📈 Sobre os Analytics
				</Typography>
				<Divider sx={{ mb: 2 }} />

				{analyticsData.has_analytics ? (
					<Alert
						severity="info"
						sx={{ mb: 2 }}
					>
						Este link já possui dados de analytics! Para ver relatórios detalhados, crie uma conta gratuita.
					</Alert>
				) : (
					<Alert
						severity="warning"
						sx={{ mb: 2 }}
					>
						Este link ainda não possui cliques. Os analytics aparecerão após o primeiro acesso.
					</Alert>
				)}

				<Typography
					variant="body2"
					color="text.secondary"
					paragraph
				>
					• <strong>Analytics Básicos:</strong> Disponíveis publicamente para todos os links
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					paragraph
				>
					• <strong>Analytics Avançados:</strong> Gráficos detalhados, localização, dispositivos (requer
					conta)
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					paragraph
				>
					• <strong>Histórico Completo:</strong> Dados históricos e exportação (requer conta)
				</Typography>

				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={2}
					sx={{ mt: 3 }}
				>
					<Button
						variant="contained"
						startIcon={<LinkIcon />}
						onClick={handleCreateLink}
						size="large"
					>
						Criar Meu Link
					</Button>
					<Button
						variant="outlined"
						onClick={() => navigate('/sign-up')}
						size="large"
					>
						Criar Conta Gratuita
					</Button>
				</Stack>
			</CardContent> */}
      <UpgradeCTA
        onSignUp={() => navigate("/sign-up")}
        onLogin={() => navigate("/sign-in")}
        onCreateLink={handleCreateLink}
      />
    </EnhancedPaper>
  );
}
