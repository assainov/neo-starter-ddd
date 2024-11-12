import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { menuItems } from './menu-items';
import Link from 'next/link';
import { AuthButtons } from './auth-buttons';
import { GitHubButton } from './github-button';

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const MobileNav = ({ isOpen, setIsOpen }: MobileNavProps) => (
  <Sheet
    onOpenChange={setIsOpen}
    open={isOpen}
  >
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
      <nav className="mt-4 flex flex-col space-y-4">
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
        <AuthButtons className="flex-col items-stretch space-x-0 space-y-4" />
        <GitHubButton className='flex md:hidden'/>
      </nav>
    </SheetContent>
  </Sheet>
);