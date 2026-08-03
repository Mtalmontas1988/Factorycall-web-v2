'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationsNoneOutlined } from '@mui/icons-material';
import { Alert, Badge, Box, Button, CircularProgress, IconButton, Paper, Popover, Stack, Typography } from '@mui/material';
import { useNotificationsContext } from '../hooks/notifications-context';
import { useI18n } from '../i18n/i18n-provider';
import { markAllNotificationsRead } from '../lib/firebase/notifications-service';
import { LanguageSelector } from './language-selector';

export function NotificationBell() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const router = useRouter();
  const { notifications, unreadCount, loading, error, userId } = useNotificationsContext();
  const { t } = useI18n();

  return <>
    <LanguageSelector />
    <IconButton onClick={event => setAnchor(event.currentTarget)} aria-label={t('notifications.title')}>
      <Badge badgeContent={unreadCount} color="error" max={99} invisible={!unreadCount}>
        <NotificationsNoneOutlined />
      </Badge>
    </IconButton>
    <Popover open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Paper sx={{ width: 360, p: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight={800}>{t('notifications.title')}</Typography>
          <Button size="small" disabled={!unreadCount} onClick={() => markAllNotificationsRead(userId)}>{t('notifications.markAllRead')}</Button>
        </Stack>
        {loading ? <Box p={3} textAlign="center"><CircularProgress size={22} /></Box> : error ? <Alert severity="error">{error}</Alert> : !notifications.length ? <Typography p={3} textAlign="center" color="text.secondary">{t('notifications.empty')}</Typography> : notifications.slice(0, 5).map(notification => <Box key={notification.id} sx={{ p: 1, my: 0.5, borderRadius: 1, bgcolor: notification.read ? 'transparent' : '#1d3048' }}><Typography variant="body2" fontWeight={notification.read ? 600 : 800}>{notification.title || t('notifications.system')}</Typography><Typography variant="caption" color="text.secondary">{notification.body || t('notifications.noDetails')}</Typography></Box>)}
        <Button fullWidth sx={{ mt: 1 }} onClick={() => { setAnchor(null); router.push('/pranesimai'); }}>{t('notifications.viewAll')}</Button>
      </Paper>
    </Popover>
  </>;
}
