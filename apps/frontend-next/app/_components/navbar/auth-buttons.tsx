import Link from 'next/link';
import { UserPlus, LogIn, LogOut } from 'lucide-react';
import { Button } from '../../_shared/ui/button';
import { GitHubButton } from './github-button';
import { ROUTE } from '../../_config/routes';
import { useLogout } from '@/_hooks/useLogoutAction';
import { useAuth } from '@/_hooks/useAuth';

export const AuthButtons = ({ className = '', onClose = () => {} }) => {
  const { user, isAuthenticated } = useAuth();

  const logout = useLogout();
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <GitHubButton className='hidden md:flex' />
      { isAuthenticated ? (
        <>
          <span>Welcome, {user?.firstName}</span>
          <Button
            onClick={() => {
              logout();

              onClose();
            }}
            variant="ghost"
          >
            <LogOut className="mr-2 size-4" />
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button
            asChild
            onClick={onClose}
            variant="ghost"
          >
            <Link href={ROUTE.AccountLogin}>
              <LogIn className="mr-2 size-4" />
              Login
            </Link>
          </Button>
          <Button
            asChild
            onClick={onClose}
          >
            <Link href={ROUTE.AccountRegister}>
              <UserPlus className="mr-2 size-4" />
              Register
            </Link>
          </Button>
        </>
      ) }
    </div>
  );
};