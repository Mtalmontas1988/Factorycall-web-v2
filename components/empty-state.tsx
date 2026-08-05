'use client';

import {
  AssessmentOutlined,
  BuildOutlined,
  EngineeringOutlined,
  InboxOutlined,
  NotificationsNoneOutlined,
  SearchOffOutlined,
} from '@mui/icons-material';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export type EmptyStateKind = 'calls' | 'technicians' | 'reports' | 'notifications' | 'inventory' | 'search';

type EmptyStateProps = {
  title: ReactNode;
  description: ReactNode;
  kind?: EmptyStateKind;
  action?: ReactNode;
  compact?: boolean;
};

const icons = {
  calls: BuildOutlined,
  technicians: EngineeringOutlined,
  reports: AssessmentOutlined,
  notifications: NotificationsNoneOutlined,
  inventory: InboxOutlined,
  search: SearchOffOutlined,
};

/** A shared, fixed-size empty state that keeps list and table layouts calm. */
export function EmptyState({ title, description, kind = 'search', action, compact = false }: EmptyStateProps) {
  const Icon = icons[kind];

  return (
    <Paper
      variant="outlined"
      sx={{
        minHeight: compact ? 168 : 260,
        display: 'grid',
        placeItems: 'center',
        px: 3,
        py: compact ? 3 : 5,
        textAlign: 'center',
        borderColor: '#293342',
        bgcolor: 'background.paper',
      }}
    >
      <Stack alignItems="center" spacing={1.25} sx={{ maxWidth: 420 }}>
        <Box
          sx={{
            width: compact ? 54 : 68,
            height: compact ? 54 : 68,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '22px',
            color: 'primary.light',
            bgcolor: 'rgba(75, 156, 255, 0.12)',
            border: '1px solid rgba(75, 156, 255, 0.22)',
          }}
        >
          <Icon sx={{ fontSize: compact ? 27 : 34 }} />
        </Box>
        <Typography variant={compact ? 'subtitle1' : 'h6'} fontWeight={750}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
        {action ? <Box sx={{ pt: 0.75 }}>{action}</Box> : null}
      </Stack>
    </Paper>
  );
}

export function EmptyStateAction({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <Button variant="outlined" onClick={onClick}>{children}</Button>;
}
