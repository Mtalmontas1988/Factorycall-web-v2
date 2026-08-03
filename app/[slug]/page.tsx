import { Portal } from '../../components/portal';
import { PortalAccessGuard } from '../../hooks/use-factory-data';
import { AuthProvider } from '../../hooks/auth-context';

export default async function ModuleRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AuthProvider><PortalAccessGuard><Portal slug={slug} /></PortalAccessGuard></AuthProvider>;
}
