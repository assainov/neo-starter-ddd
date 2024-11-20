import Link from 'next/link';

type InsteadLinkProps = {
  confirmation: string;
  link: {
    href: string;
    label: string;
  }
};

export const InsteadLink = ({ confirmation, link: { href, label } }: InsteadLinkProps) => (
  <div className="mt-8 text-center text-sm">
    {confirmation}{' '}
    <Link
      className="underline"
      href={href}
    >
      {label}
    </Link>
  </div>
);