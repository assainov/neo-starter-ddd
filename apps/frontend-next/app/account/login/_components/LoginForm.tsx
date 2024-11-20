'use client';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUserBodySchema, LoginUserBody } from '@neo/application/user';

import { ROUTE } from '@/_config/routes';
import { useNotifications } from '@/_shared/notifications';
import { useLoginMutation } from '@/account/_api/mutations';
import { Button } from '@/_shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/_shared/ui/card';
import { FormField } from '@/account/_components/FormField';
import { InsteadLink } from '@/account/_components/InsteadLink';

export const LoginForm = () => (
  <Card className="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle className="text-2xl">Login</CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <LoginFormFields />
    </CardContent>
  </Card>
);

const LoginFormFields = () => {
  const router = useRouter();
  const login = useLoginMutation();
  const addNotification = useNotifications(s => s.addNotification);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserBody>({
    resolver: zodResolver(loginUserBodySchema),
  });

  const onSubmit: SubmitHandler<LoginUserBody> = async (data) => {
    await login.mutateAsync(data);
    showSuccessNotification();
    router.push(ROUTE.Home);
  };

  const showSuccessNotification = () => {
    addNotification({
      type: 'success',
      title: 'Logged in.',
      message: 'You have successfully logged in.',
    });
  };
  return (
    <>
      <form
        className="grid gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          error={errors.email}
          id="email"
          label="Email"
          placeholder="m@example.com"
          register={register}
        />
        <FormField
          error={errors.password}
          id="password"
          label="Password"
          register={register}
          type="password"
        />
        <Button
          className="w-full"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Loading...' : 'Login'}
        </Button>
      </form>
      <InsteadLink
        confirmation='Don&apos;t have an account?'
        link={{ href: ROUTE.AccountRegister, label: 'Register' }}
      />
    </>
  );
};
