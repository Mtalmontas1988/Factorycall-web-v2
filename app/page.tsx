import { Portal } from '../components/portal';
import { PortalAccessGuard } from '../hooks/use-factory-data';
import { AuthProvider } from '../hooks/auth-context';

export default function Home() { return <AuthProvider><PortalAccessGuard><Portal /></PortalAccessGuard></AuthProvider>; }
