/**
 * 📝 LINK FORM FIELDS - SIMPLIFICADO COM MUI NATIVO
 * Campos de formulário usando TextField nativo e React Hook Form
 */

import {
    TextField,
    Switch,
    FormControlLabel,
    Collapse,
    Grid,
    Typography,
    Box,
    Chip,
    InputAdornment,
    IconButton,
    Stack
} from '@mui/material';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { LinkFormData } from './LinkFormSchema';
import { useState } from 'react';
import { AppIcon } from '@/lib/icons';

interface LinkFormFieldsProps {
    control: Control<LinkFormData>;
    errors: FieldErrors<LinkFormData>;
    isEdit?: boolean;
}

/**
 * Campos do formulário usando TextField nativo do MUI
 * Integrado com React Hook Form e validação Zod
 */
export function LinkFormFields({ control, errors, isEdit = false }: LinkFormFieldsProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showUTM, setShowUTM] = useState(false);

    return (
        <Stack spacing={3}>
            {/* 🔗 URL Original */}
            <Controller
                name="original_url"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="🔗 URL Original"
                        placeholder="https://exemplo.com/url-muito-longa"
                        error={!!errors.original_url}
                        helperText={errors.original_url?.message || 'Cole aqui a URL que deseja encurtar'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AppIcon intent="link" size={20} />
                                </InputAdornment>
                            )
                        }}
                    />
                )}
            />

            {/* 📝 Título */}
            <Controller
                name="title"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="📝 Título do Link"
                        placeholder="Dê um nome para seu link"
                        error={!!errors.title}
                        helperText={errors.title?.message || 'Opcional - Ajuda a identificar o link'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AppIcon intent="edit" size={20} />
                                </InputAdornment>
                            )
                        }}
                    />
                )}
            />

            {/* 📄 Descrição */}
            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        label="📄 Descrição"
                        placeholder="Descreva o conteúdo do link (opcional)"
                        error={!!errors.description}
                        helperText={errors.description?.message || 'Opcional - Adicione mais contexto ao seu link'}
                    />
                )}
            />

            {/* 🔧 Configurações Avançadas */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        ⚙️ Configurações Avançadas
                    </Typography>
                    <Chip
                        label={showAdvanced ? 'Ocultar' : 'Mostrar'}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        color={showAdvanced ? 'primary' : 'default'}
                        variant={showAdvanced ? 'filled' : 'outlined'}
                        size="small"
                        icon={<AppIcon intent={showAdvanced ? 'collapse' : 'expand'} size={16} />}
                    />
                </Box>

                <Collapse in={showAdvanced}>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            {/* 🏷️ Slug Personalizado */}
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="custom_slug"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="🏷️ Slug Personalizado"
                                            placeholder="meu-link-personalizado"
                                            error={!!errors.custom_slug}
                                            helperText={errors.custom_slug?.message || 'Opcional - Personalize a URL curta'}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Typography variant="body2" color="text.secondary">
                                                            /r/
                                                        </Typography>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* 🔢 Limite de Cliques */}
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="click_limit"
                                    control={control}
                                    render={({ field: { onChange, value, ...field } }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="number"
                                            label="🔢 Limite de Cliques"
                                            placeholder="1000"
                                            value={value || ''}
                                            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
                                            error={!!errors.click_limit}
                                            helperText={errors.click_limit?.message || 'Opcional - Máximo de cliques permitidos'}
                                            InputProps={{
                                                inputProps: { min: 1, max: 1000000 }
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* ⏰ Data de Início */}
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="starts_in"
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="datetime-local"
                                            label="⏰ Data de Início"
                                            value={value || ''}
                                            error={!!errors.starts_in}
                                            helperText={errors.starts_in?.message || 'Quando o link ficará ativo'}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* ⏳ Data de Expiração */}
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="expires_at"
                                    control={control}
                                    render={({ field: { value, ...field } }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="datetime-local"
                                            label="⏳ Data de Expiração"
                                            value={value || ''}
                                            error={!!errors.expires_at}
                                            helperText={errors.expires_at?.message || 'Quando o link expirará'}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        {/* ✅ Status Ativo */}
                        <Controller
                            name="is_active"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={value}
                                            onChange={(e) => onChange(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="✅ Link Ativo"
                                />
                            )}
                        />
                    </Stack>
                </Collapse>
            </Box>

            {/* 📊 Parâmetros UTM */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        📊 Parâmetros UTM
                    </Typography>
                    <Chip
                        label={showUTM ? 'Ocultar' : 'Mostrar'}
                        onClick={() => setShowUTM(!showUTM)}
                        color={showUTM ? 'secondary' : 'default'}
                        variant={showUTM ? 'filled' : 'outlined'}
                        size="small"
                        icon={<AppIcon intent={showUTM ? 'collapse' : 'expand'} size={16} />}
                    />
                </Box>

                <Collapse in={showUTM}>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Parâmetros para rastreamento no Google Analytics
                        </Typography>

                        <Grid container spacing={3}>
                            {/* UTM Source */}
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="utm_source"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="UTM Source"
                                            placeholder="google, facebook, newsletter"
                                            error={!!errors.utm_source}
                                            helperText={errors.utm_source?.message || 'Origem do tráfego'}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* UTM Medium */}
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="utm_medium"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="UTM Medium"
                                            placeholder="cpc, email, social"
                                            error={!!errors.utm_medium}
                                            helperText={errors.utm_medium?.message || 'Meio de marketing'}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* UTM Campaign */}
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="utm_campaign"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="UTM Campaign"
                                            placeholder="promocao-verao-2024"
                                            error={!!errors.utm_campaign}
                                            helperText={errors.utm_campaign?.message || 'Nome da campanha'}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* UTM Term */}
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="utm_term"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="UTM Term"
                                            placeholder="palavra-chave"
                                            error={!!errors.utm_term}
                                            helperText={errors.utm_term?.message || 'Termo de pesquisa'}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* UTM Content */}
                            <Grid item xs={12}>
                                <Controller
                                    name="utm_content"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="UTM Content"
                                            placeholder="banner-topo, link-rodape"
                                            error={!!errors.utm_content}
                                            helperText={errors.utm_content?.message || 'Conteúdo do anúncio'}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                </Collapse>
            </Box>
        </Stack>
    );
}

export default LinkFormFields;
