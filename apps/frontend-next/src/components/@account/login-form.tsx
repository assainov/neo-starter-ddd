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
import { loginUserBodySchema, LoginUserBody } from '@neo/application/user';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTE } from '@/constants/routes';

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginUserBody>({
    resolver: zodResolver(loginUserBodySchema),
  });

  const onSubmit: SubmitHandler<LoginUserBody> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
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
