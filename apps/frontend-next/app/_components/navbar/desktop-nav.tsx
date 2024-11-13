import Link from 'next/link';
import { Button } from '../../_shared/ui/button';
import { menuItems } from './menu-items';

export const DesktopNav = ({ className = '' }) => (
  <div className={`hidden md:flex md:items-center md:space-x-4 ${className}`}>
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