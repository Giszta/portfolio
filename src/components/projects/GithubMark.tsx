import { siGithub } from "simple-icons";

interface GithubMarkProps {
  className?: string;
}

export function GithubMark({ className }: GithubMarkProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d={siGithub.path} />
    </svg>
  );
}