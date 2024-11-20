import React from 'react';
import { LoginForm } from './_components/LoginForm';

const LoginPage = () => (
  <main className="flex min-h-[calc(100vh-var(--header-height))] w-full items-start justify-center px-4 pt-10 md:pt-20">
    <LoginForm />
  </main>
);

export default LoginPage;