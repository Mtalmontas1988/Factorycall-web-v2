import type { SvgIconComponent } from '@mui/icons-material';

export type PortalModule = {
  slug: string;
  label: string;
  singular: string;
  icon: SvgIconComponent;
  description: string;
  columns: string[];
  rows: string[][];
};
