// app/(public)/terms/page.tsx
import type { Metadata } from 'next'
import { Container, Typography, Box, Divider, Link } from '@mui/material'
import PublicLayout from '@/shared/layout/PublicLayout'

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://linkcharts.com.br'

export const metadata: Metadata = {
  title: 'Termos de Serviço',
  description:
    'Termos e condições de uso do Link Charts — encurtador de URLs gratuito com analytics.',
  alternates: { canonical: `${appUrl}/terms` },
  robots: { index: true, follow: true },
}

const sectionSx = { mb: 4 }
const headingSx = { fontWeight: 700, mb: 1.5 }
const bodySx = { color: 'text.secondary', lineHeight: 1.8 }

export default function TermsPage() {
  return (
    <PublicLayout showHeader showFooter variant="simple">
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Termos de Serviço
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ mb: 4 }}>
          Vigência: 6 de maio de 2026 · Link Charts
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>1. Aceitação dos termos</Typography>
          <Typography sx={bodySx}>
            Ao acessar ou usar o Link Charts, você concorda com estes Termos de Serviço e com nossa{' '}
            <Link href="/privacy">Política de Privacidade</Link>. Se não concordar, não utilize o serviço.
          </Typography>
        </Box>

        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>2. Descrição do serviço</Typography>
          <Typography sx={bodySx}>
            O Link Charts é uma plataforma gratuita de encurtamento de URLs que oferece analytics básico de cliques,
            geolocalização e dados de dispositivo. O serviço é fornecido &quot;como está&quot;, sem garantia de disponibilidade
            ininterrupta. Reservamo-nos o direito de alterar ou descontinuar funcionalidades sem aviso prévio.
          </Typography>
        </Box>

        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>3. Uso aceitável</Typography>
          <Typography sx={bodySx}>
            É expressamente proibido usar o Link Charts para encurtar URLs que contenham ou levem a:
          </Typography>
          <Box component="ul" sx={{ color: 'text.secondary', pl: 3, mt: 1, lineHeight: 2 }}>
            <li>Malware, vírus, ransomware, phishing ou qualquer código malicioso</li>
            <li>Conteúdo ilegal sob as leis brasileiras ou internacionais</li>
            <li>Spam ou mensagens comerciais não solicitadas</li>
            <li>Conteúdo que viole direitos autorais, marcas registradas ou direitos de privacidade de terceiros</li>
            <li>Conteúdo que promova violência, ódio, discriminação ou terrorismo</li>
            <li>Material sexualmente explícito envolvendo menores</li>
          </Box>
        </Box>

        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>4. Responsabilidade pelos links</Typography>
          <Typography sx={bodySx}>
            Você é inteiramente responsável pelo conteúdo das URLs que encurtar. O Link Charts não monitora
            proativamente o conteúdo dos links, mas reserva-se o direito de remover qualquer link que viole
            estes termos, sem aviso prévio e sem necessidade de justificativa.
          </Typography>
        </Box>

        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>5. Conta de usuário</Typography>
          <Typography sx={bodySx}>
            Você é responsável por manter a confidencialidade das credenciais de sua conta e por todas as
            atividades realizadas a partir dela. Notifique-nos imediatamente em caso de uso não autorizado:
            {' '}<Link href="mailto:linkcharts@gmail.com">linkcharts@gmail.com</Link>.
          </Typography>
        </Box>

        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>6. Limitação de responsabilidade</Typography>
          <Typography sx={bodySx}>
            O Link Charts não se responsabiliza por danos diretos, indiretos, incidentais ou consequentes
            decorrentes do uso ou incapacidade de uso do serviço, incluindo danos causados por links
            encurtados por terceiros. Em nenhuma hipótese nossa responsabilidade excederá o valor pago
            pelo serviço nos últimos 12 meses (zero, para uso gratuito).
          </Typography>
        </Box>

        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>7. Rescisão</Typography>
          <Typography sx={bodySx}>
            Podemos encerrar ou suspender seu acesso ao serviço, com ou sem aviso prévio, por violação
            destes termos ou por qualquer outro motivo a nosso critério. Você pode encerrar sua conta a
            qualquer momento pelo painel de configurações ou solicitando por e-mail.
          </Typography>
        </Box>

        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>8. Propriedade intelectual</Typography>
          <Typography sx={bodySx}>
            O código, design e conteúdo do Link Charts são protegidos por direitos autorais. O uso do serviço
            não transfere qualquer direito de propriedade intelectual. Links encurtados e dados de analytics
            gerados a partir dos seus links pertencem a você.
          </Typography>
        </Box>

        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>9. Lei aplicável e foro</Typography>
          <Typography sx={bodySx}>
            Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será
            submetida ao foro da comarca de São Paulo, Estado de São Paulo, com renúncia a qualquer outro,
            por mais privilegiado que seja.
          </Typography>
        </Box>

        <Box sx={sectionSx}>
          <Typography variant="h6" sx={headingSx}>10. Contato</Typography>
          <Typography sx={bodySx}>
            Para dúvidas sobre estes termos:{' '}
            <Link href="mailto:linkcharts@gmail.com">linkcharts@gmail.com</Link>
          </Typography>
        </Box>
      </Container>
    </PublicLayout>
  )
}
