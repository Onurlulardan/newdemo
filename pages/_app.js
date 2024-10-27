import '../styles/globals.css';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import AdminLayout from '@/layout/AdminLayout';
import DefaultLayout from '@/layout/DefaultLayout';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  const isAdminRoute = router.pathname.startsWith('/admin');
  const Layout = isAdminRoute ? AdminLayout : DefaultLayout;

  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
