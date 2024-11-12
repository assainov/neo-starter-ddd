import Link from 'next/link';
import { UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GitHubButton } from './github-button';

export const AuthButtons = ({ className = '' }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <GitHubButton className='hidden md:flex' />
    <Button
      asChild
      variant="ghost"
    >
      <Link href="/sign-in">
        <LogIn className="mr-2 size-4" />
        Login
      </Link>
    </Button>
    <Button asChild>
      <Link href="/sign-up">
        <UserPlus className="mr-2 size-4" />
        Sign Up
      </Link>
    </Button>
  </div>
);