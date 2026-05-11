# 0004 — React Hook Form com Zod

- Status: Accepted
- Data: 2026-05-10
- Autores: equipe Link Charts

## Contexto

A aplicação tem 8+ formulários relevantes: SignIn, SignUp, ForgotPassword, ResetPassword, VerifyEmail, CreateLink, EditLink, Profile, PasswordChange e o encurtador público (`ShorterForm`). Precisávamos de uma solução consistente de validação com tipos derivados (sem duplicar shape de form em interface + schema).

## Decisão

- **React Hook Form** para gestão de estado (`useForm`, `Controller`).
- **`@hookform/resolvers/zod`** + **Zod** para schema/validação.
- Schemas vivem próximos do form (ex: `src/features/links/components/forms/LinkFormSchema.ts`) e exportam tanto o `z.object(...)` quanto o tipo inferido (`z.infer<typeof Schema>`).

## Alternativas consideradas

- **Formik + Yup** — Mais lento (re-render em cada keystroke por padrão); type inference de Yup é menos completa que Zod; comunidade migrando.
- **State local + validação manual** — Não escala; duplicação massiva.
- **Final Form** — Ecossistema menor, integração com MUI menos polida.

## Consequências

### Positivas

- Performance: minimal re-renders (RHF gerencia estado por field).
- Tipos inferidos do schema Zod — sem duplicação `interface FormValues` + `zodSchema`.
- Schemas explícitos em arquivos versionados (ex: `LinkFormSchema.ts`).
- Pode validar tanto cliente quanto server (mesmo schema, se necessário).

### Negativas

- Duas APIs (RHF + Zod) — pequena curva de aprendizado.
- Pode ficar verboso para formulários simples (`Controller` + `register` + `handleSubmit`).
- Integração com componentes MUI complexos (Autocomplete, DateTimePicker) usa `Controller`, que é o caminho mais verboso.
