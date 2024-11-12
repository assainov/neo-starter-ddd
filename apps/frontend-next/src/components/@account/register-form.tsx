'use client';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTE } from '@/constants/routes';
import { RegisterUserBody, registerUserBodySchema } from '@neo/application/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRegister } from '@/lib/api/auth/mutations';
import { useNotifications } from '../@layout/notifications';

export const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterUserBody>({
    resolver: zodResolver(registerUserBodySchema),
  });
  const registering = useRegister({ onSuccess: () => useNotifications.getState().addNotification({
    type: 'success',
    title: 'Account created',
    message: 'You have successfully created an account',
  }) });

  const onSubmit: SubmitHandler<RegisterUserBody> = (data) => {
    registering.mutate(data);
  };

  return (
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
        <form
          className="grid gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid gap-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="John"
              {...register('firstName')}
            />
            {errors.firstName ? <div className='text-sm text-red-500'>{errors.firstName.message}</div> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              {...register('lastName')}
            />
            {errors.lastName ? <div className='text-sm text-red-500'>{errors.lastName.message}</div> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="m@example.com"
              {...register('email')}
            />
            {errors.email ? <div className='text-sm text-red-500'>{errors.email.message}</div> : null}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              {...register('password')}
            />
            {errors.password ? <div className='text-sm text-red-500'>{errors.password.message}</div> : null}
          </div>
          <Button
            className="w-full"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Loading...' : 'Create account'}
          </Button>
          {/* <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          className="w-full"
          variant="outline"
        >
          Google
        </Button> */}
        </form>
        <div className="mt-8 text-center text-sm">
          Have an account already?{' '}
          <Link
            className="underline"
            href={ROUTE.AccountLogin}
          >
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
