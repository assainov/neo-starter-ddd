import { SignUpForm } from '@/components/@sign-up/sign-up-form';
import React from 'react';

const SignInPage = () => (
  <main className="flex min-h-[calc(100vh-var(--header-height))] w-full items-start justify-center px-4 pt-10 md:pt-20">
    <SignUpForm />
  </main>
);

export default SignInPage;