import { Box } from '@mui/material';

export function BrandLogo({ width = 180, compact = false }: { width?: number; compact?: boolean }) {
  return <Box component="img" src={compact ? '/icon.png' : '/brand/factorycall-logo.png'} alt="FactoryCall" sx={{ width: compact ? 38 : width, height: compact ? 38 : 'auto', maxHeight: compact ? 38 : 62, objectFit: 'contain', objectPosition: 'left center', display: 'block' }} />;
}
