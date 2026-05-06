// app/(public)/support/page.tsx
import type { Metadata } from 'next'
import { Container, Typography, Box, Divider, Link, Paper } from '@mui/material'
import PublicLayout from '@/shared/layout/PublicLayout'

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://linkcharts.com.br'

export const metadata: Metadata = {
  title: 'Suporte',
  description:
    'Central de suporte do Link Charts — tire dúvidas, reporte problemas e entre em contato.',
  alternates: { canonical: `${appUrl}/support` },
  robots: { index: true, follow: true },
}

const FAQ = [
  {
    q: 'Como funciona o encurtamento de links?',
    a: 'Cole qualquer URL no campo da página inicial, personalize o slug se quiser, e clique em "Encurtar". Você receberá um link curto imediatamente — sem precisar de conta.',
  },
  {
    q: 'Preciso criar uma conta para usar o serviço?',
    a: 'Não. O encurtamento básico é gratuito e não exige cadastro. Uma conta é necessária apenas para acessar analytics avançado, gerenciar seus links e definir slugs personalizados.',
  },
  {
    q: 'Como posso deletar um link que criei?',
    a: 'Faça login, acesse "Meus Links" no menu principal, localize o link desejado e use a opção de exclusão. Links criados sem conta não podem ser deletados posteriormente.',
  },
  {
    q: 'Meus dados estão seguros?',
    a: 'Sim. Usamos HTTPS em todas as conexões e não vendemos dados pessoais a terceiros. Consulte nossa Política de Privacidade para detalhes completos.',
  },
  {
    q: 'Encontrei um link encurtado com conteúdo malicioso. O que fazer?',
    a: 'Envie o link (completo, incluindo o slug) para linkcharts@gmail.com com o assunto "Reporte de link". Analisamos e removemos links abusivos em até 24 horas.',
  },
]

export default function SupportPage() {
  return (
    <PublicLayout showHeader showFooter variant="simple">
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Suporte
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Dúvidas, sugestões ou problemas? Estamos aqui para ajudar.
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {/* Contato */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Fale conosco
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography color="text.secondary">
              📧 E-mail:{' '}
              <Link href="mailto:linkcharts@gmail.com">linkcharts@gmail.com</Link>
              {' '}— respondemos em até 2 dias úteis.
            </Typography>
            <Typography color="text.secondary">
              🐛 Bugs e sugestões:{' '}
              <Link href="https://github.com/bcordeirodev" target="_blank" rel="noopener noreferrer">
                github.com/bcordeirodev
              </Link>
              {' '}— abra uma issue no repositório.
            </Typography>
          </Box>
        </Box>

        {/* FAQ */}
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Perguntas frequentes
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {FAQ.map(({ q, a }) => (
            <Paper key={q} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography fontWeight={600} gutterBottom>
                {q}
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {a}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </PublicLayout>
  )
}
