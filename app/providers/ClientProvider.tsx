'use client';

import { AuthProvider } from '@/app/context/AuthContext';
import ClientProvider from '@/app/providers/ClientProvider';
import { UserProvider } from '@/app/providers/UserProvider';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider>
      <UserProvider>
        <ClientProvider>
          {children}
        </ClientProvider>
      </UserProvider>
    </AuthProvider>
  );
}