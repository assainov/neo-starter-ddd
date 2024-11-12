import { RegisterForm } from '@/components/@account/register-form';
import React from 'react';

const RegisterPage = () => (
  <main className="flex min-h-[calc(100vh-var(--header-height))] w-full items-start justify-center px-4 pt-10 md:pt-20">
    <RegisterForm />
  </main>
);

export default RegisterPage;