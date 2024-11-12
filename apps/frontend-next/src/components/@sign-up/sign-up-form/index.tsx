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

export const SignUpForm = () => (
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
          Start
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
      </div>
      <div className="mt-8 text-center text-sm">
        Have an account already?{' '}
        <Link
          className="underline"
          href="/sign-in"
        >
          Log in
        </Link>
      </div>
    </CardContent>
  </Card>
);
