import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { menuItems } from './menu-items';

export const DesktopNav = () => (
  <div className="hidden md:flex md:items-center md:space-x-4">
    {menuItems.map((item) => (
      <Button
        asChild
        key={item.href}
        variant="ghost"
      >
        <Link href={item.href}>{item.label}</Link>
      </Button>
    ))}
  </div>
);