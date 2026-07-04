import Link from "next/link";
import { ReactNode } from "react";

type CtaLinkProps = {
  href: string;
  children: ReactNode;
};

export function CtaLink({ href, children }: CtaLinkProps) {
  return (
    <Link className="cta-link" href={href} target="_blank" rel="noreferrer">
      {children}
    </Link>
  );
}
