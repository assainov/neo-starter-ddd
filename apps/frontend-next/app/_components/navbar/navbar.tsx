'use client';

import * as React from 'react';
import Link from 'next/link';
import { DesktopNav } from './desktop-nav';
import { AuthButtons } from './auth-buttons';
import { MobileNav } from './mobile-nav';

const Navbar = () => (
  <nav className="bg-background border-b">
    <div className="container">
      <div className="flex h-[var(--header-height)] items-center justify-start">
        <div className="flex shrink-0 items-center space-x-4">
          <Link
            className="text-primary text-2xl font-bold"
            href="/"
          >
            Neo Starter
          </Link>
        </div>
        <DesktopNav className='ml-10' />
        <div className="ml-auto hidden md:block">
          <AuthButtons />
        </div>
        <div className="ml-auto md:hidden">
          <MobileNav />
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
