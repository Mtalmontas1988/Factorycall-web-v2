import type * as React from 'react';

/**
 * MUI v7 keeps these layout values in `sx`; FactoryCall also supports the
 * equivalent legacy Stack props used by the existing portal markup.
 */
type Responsive<T> = T | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', T>>;

declare module '@mui/material/Stack' {
  interface StackOwnProps {
    alignItems?: Responsive<React.CSSProperties['alignItems']>;
    justifyContent?: Responsive<React.CSSProperties['justifyContent']>;
    mt?: number | string;
    mb?: number | string;
    p?: number | string;
    pb?: number | string;
  }
}

export {};
