'use client';

import * as React from 'react';
import Link from 'next/link';
import { DesktopNav } from './desktop-nav';
import { AuthButtons } from './auth-buttons';
import { MobileNav } from './mobile-nav';

const Navbar = () => {
  const [ isOpen, setIsOpen ] = React.useState(false);

  return (
    <nav className="bg-background border-b">
      <div className="container">
        <div className="flex h-[var(--header-height)] items-center justify-between">
          <div className="flex shrink-0 items-center space-x-4">
            <Link
              className="text-primary text-2xl font-bold"
              href="/"
            >
              Neo Starter
            </Link>
          </div>
          <DesktopNav />
          <div className="hidden md:block">
            <AuthButtons />
          </div>
          <div className="md:hidden">
            <MobileNav
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
