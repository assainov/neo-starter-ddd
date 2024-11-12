import { SignInForm } from '@/components/@sign-in/sign-in-form';
import React from 'react';

const SignUpPage = () => (
  <main className="flex min-h-[calc(100vh-var(--header-height))] w-full items-start justify-center px-4 pt-10 md:pt-20">
    <SignInForm />
  </main>
);

export default SignUpPage;