/**
 * 🎨 CONFIGURAÇÕES MUI OTIMIZADAS - LINK CHART
 * Configurações essenciais do Material-UI organizadas por categoria
 */

import { Theme } from '@mui/material/styles/createTheme';

// ========================================
// 🎯 CONFIGURAÇÕES ESSENCIAIS
// ========================================

/**
 * Configurações de tipografia otimizadas
 */
export const typography = {
	fontFamily: ['Inter var', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
	fontWeightLight: 300,
	fontWeightRegular: 400,
	fontWeightMedium: 500,
	fontSize: 13,
	body1: { fontSize: '0.8125rem' },
	body2: { fontSize: '0.8125rem' }
};

/**
 * Breakpoints responsivos padronizados
 */
export const breakpoints = {
	values: {
		xs: 0,
		sm: 600,
		md: 960,
		lg: 1280,
		xl: 1920
	}
};

// ========================================
// 🧩 COMPONENTES MUI ESSENCIAIS
// ========================================

/**
 * Configurações de botões otimizadas
 */
const buttonComponents = {
	MuiButton: {
		defaultProps: {
			variant: 'text' as const,
			color: 'inherit' as const
		},
		styleOverrides: {
			root: ({ theme }: { theme: Theme }) => ({
				textTransform: 'none',
				borderRadius: theme.spacing(1.5), // 12px
				fontWeight: 600,
				transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
				'&:hover': {
					transform: 'translateY(-1px)'
				}
			}),
			sizeMedium: {
				height: 36,
				minHeight: 36,
				maxHeight: 36,
				paddingLeft: 16,
				paddingRight: 16
			},
			sizeSmall: {
				height: 32,
				minHeight: 32,
				maxHeight: 32,
				paddingLeft: 12,
				paddingRight: 12
			},
			sizeLarge: {
				height: 40,
				minHeight: 40,
				maxHeight: 40,
				paddingLeft: 20,
				paddingRight: 20
			},
			contained: {
				boxShadow: 'none',
				'&:hover, &:focus': {
					boxShadow: 'none'
				}
			}
		}
	},
	MuiIconButton: {
		styleOverrides: {
			root: ({ theme }: { theme: Theme }) => ({
				borderRadius: theme.spacing(1.5) // 12px PADRÃO
			}),
			sizeMedium: { width: 36, height: 36, maxHeight: 36 },
			sizeSmall: { width: 32, height: 32, maxHeight: 32 },
			sizeLarge: { width: 40, height: 40, maxHeight: 40 }
		}
	},
	MuiButtonGroup: {
		defaultProps: { color: 'secondary' as const },
		styleOverrides: {
			root: ({ theme }: { theme: Theme }) => ({
				borderRadius: theme.spacing(1.5) // 12px PADRÃO
			})
		}
	}
};

/**
 * Configurações de inputs otimizadas
 */
const inputComponents = {
	MuiTextField: {
		defaultProps: { color: 'secondary' as const },
		styleOverrides: {
			root: {
				'& > .MuiFormHelperText-root': { marginLeft: 11 }
			}
		}
	},
	MuiInputLabel: {
		defaultProps: { color: 'secondary' as const },
		styleOverrides: {
			shrink: { transform: 'translate(11px, -7px) scale(0.8)' },
			root: {
				transform: 'translate(11px, 8px) scale(1)',
				'&.Mui-focused': {}
			}
		}
	},
	MuiInputBase: {
		styleOverrides: {
			root: ({ theme }: { theme: Theme }) => ({
				minHeight: 36,
				borderRadius: theme.spacing(1.5), // 12px PADRÃO
				lineHeight: 1
			}),
			legend: { fontSize: '0.75em' },
			input: { padding: '5px 11px' },
			adornedStart: { paddingLeft: '11px!important' },
			sizeSmall: ({ theme }: { theme: Theme }) => ({
				height: 32,
				minHeight: 32,
				borderRadius: theme.spacing(1.5)
			}),
			sizeMedium: ({ theme }: { theme: Theme }) => ({
				height: 36,
				minHeight: 36,
				borderRadius: theme.spacing(1.5)
			}),
			sizeLarge: ({ theme }: { theme: Theme }) => ({
				height: 40,
				minHeight: 40,
				borderRadius: theme.spacing(1.5)
			})
		}
	},
	MuiOutlinedInput: {
		defaultProps: { color: 'secondary' as const },
		styleOverrides: {
			root: {},
			input: { padding: '5px 11px' }
		}
	},
	MuiFilledInput: {
		styleOverrides: {
			root: ({ theme }: { theme: Theme }) => ({
				paddingLeft: `10px`,
				borderRadius: theme.spacing(1),
				backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
				transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
				'&:hover:not(.Mui-disabled)': {
					backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
				},
				'&.Mui-focused': {
					backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
				},
				'&:after': {
					borderBottomColor: theme.palette.primary.main,
					borderBottomWidth: '2px'
				},
				'&:before': {
					display: 'none'
				}
			}),
			input: ({ theme }: { theme: Theme }) => ({
				padding: '16px 20px 12px 20px',
				fontSize: '1rem',
				'&::placeholder': {
					paddingLeft: '4px',
					opacity: 0.7
				}
			}),
			inputMultiline: {
				padding: '16px 20px 12px 20px'
			}
		}
	},
	MuiSelect: {
		defaultProps: { color: 'secondary' as const },
		styleOverrides: { select: { minHeight: 0 } }
	}
};

/**
 * Configurações de superfícies (Paper, Card, Dialog, Box)
 */
const surfaceComponents = {
	MuiPaper: {
		styleOverrides: {
			root: ({ theme }: { theme: Theme }) => ({
				backgroundImage: 'none',
				borderRadius: theme.spacing(2) // 16px
			})
		}
	},
	MuiCard: {
		styleOverrides: {
			root: ({ theme }: { theme: Theme }) => ({
				borderRadius: theme.spacing(2), // 16px
				backgroundColor: theme.palette.background.paper, // Garantir background consistente
				transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
				'&:hover': {
					transform: 'translateY(-2px)'
				}
			})
		}
	},
	MuiBox: {
		styleOverrides: {
			root: ({ theme }: { theme: Theme }) => ({
				// Background padrão para Box quando usado como container de métricas
				'&.metric-container, &.tab-description-container': {
					backgroundColor: theme.palette.background.paper,
					borderRadius: theme.spacing(2)
				}
			})
		}
	},
	MuiDialog: {
		styleOverrides: {
			paper: ({ theme }: { theme: Theme }) => ({
				borderRadius: theme.spacing(1.5) // 12px PADRÃO
			})
		}
	},
	MuiPopover: {
		styleOverrides: {
			paper: ({ theme }: { theme: Theme }) => ({
				borderRadius: theme.spacing(1.5) // 12px PADRÃO
			})
		}
	}
};

/**
 * Configurações de navegação e controles
 */
const navigationComponents = {
	MuiTab: {
		styleOverrides: {
			root: {
				textTransform: 'none',
				transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
				'&.Mui-selected': {
					backgroundColor: 'rgba(25, 118, 210, 0.06)',
					color: 'primary.main',
					'&:hover': {
						backgroundColor: 'rgba(25, 118, 210, 0.08)'
					}
				}
			}
		}
	},
	MuiAppBar: {
		defaultProps: { enableColorOnDark: true },
		styleOverrides: { root: { backgroundImage: 'none' } }
	}
};

/**
 * Configurações de controles de formulário
 */
const formControlComponents = {
	MuiSlider: { defaultProps: { color: 'secondary' as const } },
	MuiCheckbox: { defaultProps: { color: 'secondary' as const } },
	MuiRadio: { defaultProps: { color: 'secondary' as const } },
	MuiSwitch: { defaultProps: { color: 'secondary' as const } }
};

/**
 * Configurações de utilitários
 */
const utilityComponents = {
	MuiSvgIcon: {
		styleOverrides: {
			sizeSmall: { width: 16, height: 16 },
			sizeMedium: { width: 20, height: 20 },
			sizeLarge: { width: 24, height: 24 }
		}
	},
	MuiAvatar: {
		styleOverrides: { root: { width: 36, height: 36 } }
	},
	MuiDrawer: {
		styleOverrides: { paper: {} }
	},
	MuiFormHelperText: {
		styleOverrides: { root: {} }
	},
	MuiInputAdornment: {
		styleOverrides: { root: { marginRight: 0 } }
	},
	MuiTypography: {
		styleOverrides: {
			h1: { fontWeight: 700, lineHeight: 1.2 },
			h2: { fontWeight: 700, lineHeight: 1.3 },
			h3: { fontWeight: 600, lineHeight: 1.3 },
			h4: { fontWeight: 600, lineHeight: 1.4 },
			h5: { fontWeight: 600, lineHeight: 1.4 },
			h6: { fontWeight: 600, lineHeight: 1.4 }
		},
		variants: [
			{
				props: { color: 'text.secondary' },
				style: { color: 'text.secondary' }
			}
		]
	}
};

/**
 * Configurações de alta prioridade (z-index)
 */
const highPriorityComponents = {
	MuiPickersPopper: {
		styleOverrides: { root: { zIndex: 99999 } }
	},
	MuiAutocomplete: {
		styleOverrides: { popper: { zIndex: 99999 } }
	}
};

// ========================================
// 📦 EXPORT CONSOLIDADO
// ========================================

/**
 * Todas as configurações MUI consolidadas
 */
export const muiComponents = {
	...buttonComponents,
	...inputComponents,
	...surfaceComponents,
	...navigationComponents,
	...formControlComponents,
	...utilityComponents,
	...highPriorityComponents
};

/**
 * Configurações completas do tema MUI otimizadas
 */
export const optimizedThemeOptions = {
	typography,
	breakpoints,
	components: muiComponents
} as const;
