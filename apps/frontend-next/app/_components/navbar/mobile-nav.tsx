'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '../../_shared/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '../../_shared/ui/sheet';
import { menuItems } from './menu-items';
import Link from 'next/link';
import { AuthButtons } from './auth-buttons';
import { GitHubButton } from './github-button';

export const MobileNav = () => {
  const [ isOpen, setIsOpen ] = useState(false);
  return (
    <Sheet
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      <SheetTitle className='hidden'>
        Mobile Menu
      </SheetTitle>
      <SheetTrigger asChild>
        <Button
          aria-label="Open menu"
          className="relative"
          size="icon"
          variant="ghost"
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-[240px] sm:w-[300px]"
        side="right"
      >
        <SheetDescription className='hidden'>Menu</SheetDescription>
        <nav className="mt-4 flex h-full flex-col space-y-4 md:py-10">
          {menuItems.map((item) => (
            <Button
              asChild
              key={item.href}
              onClick={() => setIsOpen(false)}
              variant="ghost"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
          <div
            aria-description='space-filler'
            className='grow'
          />
          <AuthButtons
            className="flex-col items-stretch space-x-0 space-y-4"
            onClose={() => setIsOpen(false)}
          />
          <GitHubButton className='flex md:hidden'/>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
