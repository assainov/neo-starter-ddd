'use client';
import Link from 'next/link';

import { Button } from '../../_shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../_shared/ui/card';
import { Input } from '../../_shared/ui/input';
import { Label } from '../../_shared/ui/label';
import { loginUserBodySchema, LoginUserBody } from '@neo/application/user';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTE } from '../../_config/routes';
import { useLogin } from '../_api/mutations';
import { useNotifications } from '../../_shared/notifications';

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginUserBody>({
    resolver: zodResolver(loginUserBodySchema),
  });
  const login = useLogin({ onSuccess: () => useNotifications.getState().addNotification({
    type: 'success',
    title: 'Logged in.',
    message: 'You have successfully logged in.',
  }) });

  const onSubmit: SubmitHandler<LoginUserBody> = async (data) => {
    login.mutate(data);
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
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
              {/* <Link
              className="ml-auto inline-block text-sm underline"
              href="#"
            >
              Forgot your password?
            </Link> */}
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
            {isSubmitting ? 'Loading...' : 'Login'}
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
          <GoogleIcon />
          Google
        </Button> */}
        </form>
        <div className="mt-8 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link
            className="underline"
            href={ROUTE.AccountRegister}
          >
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
