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

export const SignInForm = () => (
  <Card className="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle className="text-2xl">Login</CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="m@example.com"
            required
            type="email"
          />
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
            required
            type="password"
          />
        </div>
        <Button
          className="w-full"
          type="submit"
        >
          Login
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
      </div>
      <div className="mt-8 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link
          className="underline"
          href="/sign-up"
        >
          Sign up
        </Link>
      </div>
    </CardContent>
  </Card>
);
