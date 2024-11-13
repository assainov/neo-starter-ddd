
import GitHubIcon from '../../_shared/icons/github';
import { Button } from '../../_shared/ui/button';
import Link from 'next/link';

export const GitHubButton = ({ className = '' }) => (
  <Button
    asChild
    className={className}
    variant="ghost"
  >
    <Link
      aria-label="GitHub repository"
      href="https://github.com/assainov/neo-starter-ddd"
      rel="noopener noreferrer"
      target="_blank"
    >
      <GitHubIcon size={15} />
    </Link>
  </Button>
);