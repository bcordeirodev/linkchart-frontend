// app/(public)/privacy/page.tsx
import type { Metadata } from "next";
import { Container, Typography, Box, Divider, Link } from "@mui/material";
import PublicLayout from "@/shared/layout/PublicLayout";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkcharts.com.br";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como o Link Charts coleta, usa e protege seus dados pessoais conforme a LGPD e a CCPA.",
  alternates: { canonical: `${appUrl}/privacy` },
  robots: { index: true, follow: true },
};

const sectionSx = { mb: 4 };
const headingSx = { fontWeight: 700, mb: 1.5 };
const bodySx = { color: "text.secondary", lineHeight: 1.8 };

export default function PrivacyPage() {
  return (
    <PublicLayout chrome="minimal" variant="simple">
      <Container
        maxWidth="md"
        sx={{ pt: { xs: 7, md: 8 }, pb: { xs: 6, md: 8 } }}
      >
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Política de Privacidade
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ mb: 4 }}>
          Vigência: 6 de maio de 2026 · Link Charts
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {/* 1 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            1. Quem somos
          </Typography>
          <Typography sx={bodySx}>
            Link Charts é um serviço gratuito de encurtamento de URLs com
            analytics, operado por Bruno Cordeiro. Somos o controlador dos seus
            dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD — Lei
            13.709/2018). Para entrar em contato:{" "}
            <Link href="mailto:linkcharts@gmail.com">linkcharts@gmail.com</Link>
            .
          </Typography>
        </Box>

        {/* 2 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            2. Dados que coletamos
          </Typography>
          <Typography sx={bodySx}>
            Coletamos as seguintes categorias de dados ao usar o Link Charts:
          </Typography>
          <Box
            component="ul"
            sx={{ color: "text.secondary", pl: 3, mt: 1, lineHeight: 2 }}
          >
            <li>
              <strong>URLs encurtadas:</strong> o endereço original que você
              fornece.
            </li>
            <li>
              <strong>Dados de cliques:</strong> data, hora, país de origem,
              tipo de dispositivo, navegador e sistema operacional de cada
              visitante que acessa seus links.
            </li>
            <li>
              <strong>Endereço IP:</strong> usado para geolocalização aproximada
              (país/região) e proteção contra abuso.
            </li>
            <li>
              <strong>Cookies e identificadores:</strong> preferência de idioma,
              sessão autenticada, e — com seu consentimento — cookies de
              analytics e publicidade.
            </li>
            <li>
              <strong>Dados de conta:</strong> nome e endereço de e-mail, caso
              você crie uma conta.
            </li>
          </Box>
        </Box>

        {/* 3 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            3. Finalidade e base legal (LGPD art. 7)
          </Typography>
          <Box
            component="ul"
            sx={{ color: "text.secondary", pl: 3, mt: 1, lineHeight: 2 }}
          >
            <li>
              <strong>Funcionamento da plataforma</strong> (encurtamento,
              redirecionamento, conta): execução de contrato — art. 7, V.
            </li>
            <li>
              <strong>Analytics de cliques</strong> (estatísticas dos seus
              links): legítimo interesse — art. 7, IX.
            </li>
            <li>
              <strong>Google Analytics</strong> (comportamento de navegação):
              consentimento — art. 7, I. Ativado apenas se você aceitar cookies
              de analytics.
            </li>
            <li>
              <strong>Google AdSense</strong> (publicidade): consentimento —
              art. 7, I. Ativado apenas se você aceitar cookies de publicidade.
            </li>
          </Box>
        </Box>

        {/* 4 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            4. Compartilhamento de dados
          </Typography>
          <Typography sx={bodySx}>
            Não vendemos seus dados pessoais. Compartilhamos apenas com os
            seguintes prestadores de serviço, para as finalidades indicadas:
          </Typography>
          <Box
            component="ul"
            sx={{ color: "text.secondary", pl: 3, mt: 1, lineHeight: 2 }}
          >
            <li>
              <strong>Google Analytics (Google LLC):</strong> análise de
              comportamento de navegação — somente com consentimento
              (analytics_storage).
            </li>
            <li>
              <strong>Google AdSense (Google LLC):</strong> veiculação de
              publicidade — somente com consentimento (ad_storage, ad_user_data,
              ad_personalization).
            </li>
          </Box>
        </Box>

        {/* 5 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            5. Seus direitos (LGPD art. 18)
          </Typography>
          <Typography sx={bodySx}>
            Como titular de dados, você tem os seguintes direitos:
          </Typography>
          <Box
            component="ul"
            sx={{ color: "text.secondary", pl: 3, mt: 1, lineHeight: 2 }}
          >
            <li>Confirmação da existência de tratamento</li>
            <li>Acesso aos dados</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados</li>
            <li>
              Anonimização, bloqueio ou eliminação de dados desnecessários
            </li>
            <li>Portabilidade dos dados</li>
            <li>Informação sobre compartilhamento com terceiros</li>
            <li>Revogação do consentimento a qualquer momento</li>
          </Box>
          <Typography sx={{ ...bodySx, mt: 1 }}>
            Para exercer seus direitos:{" "}
            <Link href="mailto:linkcharts@gmail.com">linkcharts@gmail.com</Link>
            . Ou use o link &quot;Não vender meus dados&quot; no rodapé para
            gerenciar suas preferências de cookies.
          </Typography>
        </Box>

        {/* 6 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            6. Transferência internacional de dados
          </Typography>
          <Typography sx={bodySx}>
            O Google Analytics e o Google AdSense processam dados nos Estados
            Unidos. Essas transferências ocorrem com base nas cláusulas
            contratuais padrão aprovadas pela Comissão Europeia e salvaguardas
            equivalentes aceitas pela ANPD.
          </Typography>
        </Box>

        {/* 7 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            7. Retenção de dados
          </Typography>
          <Box
            component="ul"
            sx={{ color: "text.secondary", pl: 3, mt: 1, lineHeight: 2 }}
          >
            <li>
              <strong>Logs de cliques:</strong> 24 meses.
            </li>
            <li>
              <strong>Cookies de preferência:</strong> 6 meses.
            </li>
            <li>
              <strong>Dados de conta:</strong> enquanto a conta estiver ativa +
              30 dias após exclusão.
            </li>
          </Box>
        </Box>

        {/* 8 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            8. Segurança
          </Typography>
          <Typography sx={bodySx}>
            Utilizamos HTTPS em todas as comunicações, acesso restrito ao banco
            de dados e revisão periódica de permissões. Nenhum sistema é 100%
            seguro; em caso de incidente que afete seus dados, notificaremos
            conforme exigido pela LGPD.
          </Typography>
        </Box>

        {/* 9 — CCPA */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            9. Direitos de residentes da Califórnia (CCPA)
          </Typography>
          <Typography sx={bodySx}>
            Se você reside na Califórnia (EUA), a Lei de Privacidade do
            Consumidor da Califórnia (CCPA) garante direitos adicionais:
          </Typography>
          <Box
            component="ul"
            sx={{ color: "text.secondary", pl: 3, mt: 1, lineHeight: 2 }}
          >
            <li>
              <strong>Direito de saber:</strong> quais dados pessoais coletamos
              e com quem compartilhamos.
            </li>
            <li>
              <strong>Direito de exclusão:</strong> solicitar a exclusão dos
              seus dados pessoais.
            </li>
            <li>
              <strong>Direito de opt-out da venda:</strong> não vendemos dados
              pessoais. Para desativar o compartilhamento com parceiros de
              publicidade, use o link &quot;Não vender meus dados&quot; no
              rodapé.
            </li>
            <li>
              <strong>Direito à não-discriminação:</strong> não discriminamos
              usuários que exercem seus direitos CCPA.
            </li>
          </Box>
          <Typography sx={{ ...bodySx, mt: 1 }}>
            Para exercer direitos CCPA:{" "}
            <Link href="mailto:linkcharts@gmail.com">linkcharts@gmail.com</Link>
            .
          </Typography>
        </Box>

        {/* 10 — Cookies */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            10. Tabela de cookies
          </Typography>
          <Box sx={{ overflowX: "auto" }}>
            <Box
              component="table"
              sx={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.875rem",
                color: "text.secondary",
              }}
            >
              <Box component="thead">
                <Box
                  component="tr"
                  sx={{ borderBottom: "1px solid", borderColor: "divider" }}
                >
                  {["Cookie", "Finalidade", "Duração", "Categoria"].map((h) => (
                    <Box
                      key={h}
                      component="th"
                      sx={{
                        textAlign: "left",
                        py: 1,
                        pr: 2,
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                    >
                      {h}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {[
                  [
                    "cc_cookie",
                    "Preferência de consentimento",
                    "6 meses",
                    "Necessário",
                  ],
                  [
                    "i18nextLng",
                    "Preferência de idioma",
                    "1 ano",
                    "Necessário",
                  ],
                  [
                    "_ga",
                    "Identificador de sessão (GA)",
                    "2 anos",
                    "Analytics",
                  ],
                  ["_ga_*", "Estado de sessão (GA)", "2 anos", "Analytics"],
                  [
                    "_gcl_au",
                    "Atribuição de conversão",
                    "3 meses",
                    "Publicidade",
                  ],
                  ["IDE", "Personalização de anúncios", "1 ano", "Publicidade"],
                ].map(([name, purpose, duration, category]) => (
                  <Box
                    component="tr"
                    key={name}
                    sx={{ borderBottom: "1px solid", borderColor: "divider" }}
                  >
                    <Box
                      component="td"
                      sx={{
                        py: 1,
                        pr: 2,
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                      }}
                    >
                      {name}
                    </Box>
                    <Box component="td" sx={{ py: 1, pr: 2 }}>
                      {purpose}
                    </Box>
                    <Box component="td" sx={{ py: 1, pr: 2 }}>
                      {duration}
                    </Box>
                    <Box component="td" sx={{ py: 1 }}>
                      {category}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* 11 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            11. Atualizações desta política
          </Typography>
          <Typography sx={bodySx}>
            Esta política pode ser atualizada. A data de vigência no topo indica
            a versão em vigor. Mudanças significativas serão comunicadas por
            e-mail aos usuários cadastrados.
          </Typography>
        </Box>

        {/* 12 */}
        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>
            12. Contato e responsável pelo tratamento
          </Typography>
          <Typography sx={bodySx}>
            Bruno Cordeiro · Link Charts
            <br />
            E-mail:{" "}
            <Link href="mailto:linkcharts@gmail.com">linkcharts@gmail.com</Link>
            <br />
            GitHub:{" "}
            <Link
              href="https://github.com/bcordeirodev"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/bcordeirodev
            </Link>
          </Typography>
        </Box>
      </Container>
    </PublicLayout>
  );
}
