import Link from 'next/link';
import { UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GitHubButton } from './github-button';
import { ROUTE } from '@/constants/routes';

export const AuthButtons = ({ className = '' }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <GitHubButton className='hidden md:flex' />
    <Button
      asChild
      variant="ghost"
    >
      <Link href={ROUTE.AccountLogin}>
        <LogIn className="mr-2 size-4" />
        Login
      </Link>
    </Button>
    <Button asChild>
      <Link href={ROUTE.AccountRegister}>
        <UserPlus className="mr-2 size-4" />
        Register
      </Link>
    </Button>
  </div>
);