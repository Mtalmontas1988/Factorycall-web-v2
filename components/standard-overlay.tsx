'use client';

import { Close } from '@mui/icons-material';
import type { ReactNode } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  Stack,
  type DialogProps,
  type DrawerProps,
  Typography,
} from '@mui/material';

export const STANDARD_DRAWER_WIDTH = 600;

type StandardDrawerProps = Omit<DrawerProps, 'children'> & {
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

/** Shared right-side detail surface for portal modules. */
export function StandardDrawer({ title, children, footer, onClose, PaperProps, ...props }: StandardDrawerProps) {
  const paperSx = PaperProps?.sx;
  if (!title) {
    return <Drawer {...props} onClose={onClose} PaperProps={{ ...PaperProps, sx: { ...paperSx, width: { xs: '100%', sm: STANDARD_DRAWER_WIDTH }, bgcolor: 'background.paper' } }}>{children}</Drawer>;
  }
  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      PaperProps={{ ...PaperProps, sx: { ...paperSx, width: { xs: '100%', sm: STANDARD_DRAWER_WIDTH }, bgcolor: 'background.paper' } }}
      {...props}
    >
      <Stack sx={{ height: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6">{title}</Typography>
          <IconButton aria-label="Uždaryti" onClick={() => onClose?.({}, 'backdropClick')}>
            <Close />
          </IconButton>
        </Stack>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2.5 }}>{children}</Box>
        {footer ? <Box sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>{footer}</Box> : null}
      </Stack>
    </Drawer>
  );
}

type StandardDialogProps = Omit<DialogProps, 'children'> & {
  title?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
};

/** Shared dialog shell for create, edit, details and confirmation actions. */
export function UniversalDialog({ title, children, actions, onClose, ...props }: StandardDialogProps) {
  if (!title) return <Dialog onClose={onClose} {...props}>{children}</Dialog>;
  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} {...props}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>{title}</Box>
          <IconButton aria-label="Uždaryti" onClick={() => onClose?.({}, 'escapeKeyDown')}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  );
}

/** Backward-compatible name for modules migrated before RC3 completion. */
export const StandardDialog = UniversalDialog;
