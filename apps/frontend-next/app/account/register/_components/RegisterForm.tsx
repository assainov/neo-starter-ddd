'use client';

import { Button } from '@/_shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/_shared/ui/card';
import { ROUTE } from '@/_config/routes';
import { RegisterUserBody, registerUserBodySchema } from '@neo/application/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNotifications } from '@/_shared/notifications';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/account/_api/mutations';
import { FormField } from '@/account/_components/FormField';
import { InsteadLink } from '@/account/_components/InsteadLink';

export const RegisterForm = () => (
  <Card className="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle className="text-2xl">
        Create an account
      </CardTitle>
      <CardDescription>
        Enter your email to start creating your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <RegisterFormFields />
      <InsteadLink
        confirmation='Have an account already?'
        link={{ href: ROUTE.AccountLogin, label: 'Login' }}
      />
    </CardContent>
  </Card>
);

const RegisterFormFields = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterUserBody>({
    resolver: zodResolver(registerUserBodySchema),
  });
  const router = useRouter();
  const registering = useRegisterMutation({ onSuccess: () => {
    useNotifications.getState().addNotification({
      type: 'success',
      title: 'Account created',
      message: 'Please login to continue.',
    });

    router.push(ROUTE.AccountLogin);
  } });

  const onSubmit: SubmitHandler<RegisterUserBody> = (data) => {
    registering.mutate(data);
  };

  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        error={errors.firstName}
        id="firstName"
        label="First name"
        placeholder="John"
        register={register}
      />
      <FormField
        error={errors.lastName}
        id="lastName"
        label="Last name"
        placeholder="Doe"
        register={register}
      />
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
        placeholder='*******'
        register={register}
        type="password"
      />
      <Button
        className="w-full"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Loading...' : 'Create account'}
      </Button>
    </form>
  );
};