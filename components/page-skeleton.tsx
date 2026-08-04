'use client';

import { Box, Paper, Skeleton, Stack } from '@mui/material';

type PageSkeletonProps = {
  rows?: number;
  showFilters?: boolean;
  showMetrics?: boolean;
};

/** Shared fixed-geometry loading surface that prevents content reflow. */
export function PageSkeleton({ rows = 6, showFilters = true, showMetrics = false }: PageSkeletonProps) {
  return (
    <Stack spacing={2.5} aria-busy="true" aria-label="Įkeliama">
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5}>
        <Box><Skeleton variant="text" width={190} height={42} /><Skeleton variant="text" width={280} /></Box>
        <Skeleton variant="rounded" width={150} height={40} />
      </Stack>
      {showMetrics ? <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>{Array.from({ length: 6 }, (_, index) => <Paper key={index} sx={{ p: 2.25, minHeight: 126 }}><Skeleton width="62%" /><Skeleton width="35%" height={52} /></Paper>)}</Box> : null}
      {showFilters ? <Paper sx={{ p: 2, border: '1px solid #293342' }}><Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}><Skeleton variant="rounded" height={40} sx={{ flexGrow: 1 }} />{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} variant="rounded" width={145} height={40} />)}</Stack></Paper> : null}
      <Paper sx={{ border: '1px solid #293342', overflow: 'hidden' }}><Box p={2.5}><Skeleton width="28%" /><Skeleton width="46%" /></Box><Stack spacing={0} sx={{ px: 2.5, pb: 2.5 }}>{Array.from({ length: rows }, (_, index) => <Stack key={index} direction="row" spacing={2} alignItems="center" sx={{ minHeight: 52, borderTop: '1px solid #293342' }}><Skeleton width="18%" /><Skeleton sx={{ flexGrow: 1 }} /><Skeleton width="16%" /><Skeleton width={64} /></Stack>)}</Stack></Paper>
    </Stack>
  );
}

export function InlineListSkeleton({ rows = 4 }: { rows?: number }) {
  return <Stack spacing={1.25} p={2.5} aria-busy="true" aria-label="Įkeliama">{Array.from({ length: rows }, (_, index) => <Stack key={index} spacing={0.5}><Skeleton width="58%" /><Skeleton width="82%" /></Stack>)}</Stack>;
}
