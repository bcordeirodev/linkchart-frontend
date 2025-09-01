/**
 * 🎨 CONFIGURAÇÕES MUI OTIMIZADAS - LINK CHART
 * Configurações essenciais do Material-UI organizadas por categoria
 */

import { ThemeOptions } from '@mui/material/styles/createTheme';

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
			root: {
				textTransform: 'none',
				borderRadius: 8
			},
			sizeMedium: {
				height: 36,
				minHeight: 36,
				maxHeight: 36
			},
			sizeSmall: {
				height: 32,
				minHeight: 32,
				maxHeight: 32
			},
			sizeLarge: {
				height: 40,
				minHeight: 40,
				maxHeight: 40
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
			root: { borderRadius: 8 },
			sizeMedium: { width: 36, height: 36, maxHeight: 36 },
			sizeSmall: { width: 32, height: 32, maxHeight: 32 },
			sizeLarge: { width: 40, height: 40, maxHeight: 40 }
		}
	},
	MuiButtonGroup: {
		defaultProps: { color: 'secondary' as const },
		styleOverrides: { contained: { borderRadius: 8 } }
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
			root: {
				minHeight: 36,
				borderRadius: 8,
				lineHeight: 1
			},
			legend: { fontSize: '0.75em' },
			input: { padding: '5px 11px' },
			adornedStart: { paddingLeft: '11px!important' },
			sizeSmall: { height: 32, minHeight: 32, borderRadius: 8 },
			sizeMedium: { height: 36, minHeight: 36, borderRadius: 8 },
			sizeLarge: { height: 40, minHeight: 40, borderRadius: 8 }
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
			root: {
				borderRadius: 8,
				'&:before, &:after': { display: 'none' }
			},
			input: { padding: '5px 11px' }
		}
	},
	MuiSelect: {
		defaultProps: { color: 'secondary' as const },
		styleOverrides: { select: { minHeight: 0 } }
	}
};

/**
 * Configurações de superfícies (Paper, Card, Dialog)
 */
const surfaceComponents = {
	MuiPaper: {
		styleOverrides: {
			root: { backgroundImage: 'none' },
			rounded: { borderRadius: 12 }
		}
	},
	MuiCard: {
		styleOverrides: {
			root: {
				borderRadius: 12,
				transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
			}
		}
	},
	MuiDialog: {
		styleOverrides: {
			paper: { borderRadius: 12 }
		}
	},
	MuiPopover: {
		styleOverrides: {
			paper: { borderRadius: 8 }
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
