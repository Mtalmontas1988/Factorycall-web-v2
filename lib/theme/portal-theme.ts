import { createTheme } from '@mui/material/styles';

/**
 * The single visual baseline for FactoryCall portal UI surfaces.
 * Company-specific overrides may be layered here by a future provider.
 */
export const portalTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4b9cff' },
    background: { default: '#11161d', paper: '#181f29' },
    text: { primary: '#edf3fb', secondary: '#8f9cad' },
    divider: '#293342',
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h4: { fontWeight: 750 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: { defaultProps: { size: 'small' }, styleOverrides: { root: { minHeight: 36, borderRadius: 9, paddingInline: 14, whiteSpace: 'nowrap' } } },
    MuiIconButton: { defaultProps: { size: 'small' }, styleOverrides: { root: { width: 36, height: 36, borderRadius: 9 } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 14, minWidth: 0 } } },
    MuiDialog: { styleOverrides: { paper: { border: '1px solid #293342', borderRadius: 16 } } },
    MuiDialogTitle: { styleOverrides: { root: { padding: '20px 24px 12px', fontWeight: 750 } } },
    MuiDialogContent: { styleOverrides: { root: { padding: '16px 24px' } } },
    MuiDialogActions: { styleOverrides: { root: { padding: '12px 24px 20px', gap: 8, flexWrap: 'wrap' } } },
    MuiDrawer: { styleOverrides: { paper: { borderColor: '#293342' } } },
    MuiTableContainer: { styleOverrides: { root: { maxWidth: '100%', overflowX: 'auto' } } },
    MuiTableCell: { styleOverrides: { head: { padding: '12px 16px', fontWeight: 750, color: '#8f9cad' }, root: { padding: '12px 16px', borderColor: '#293342' } } },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiTooltip: { defaultProps: { enterDelay: 300 } },
  },
});
