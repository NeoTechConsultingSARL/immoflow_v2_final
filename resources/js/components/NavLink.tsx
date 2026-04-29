import { Link, usePage } from "@inertiajs/react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps {
  className?: string | ((props: { isActive: boolean; isPending: boolean }) => string);
  activeClassName?: string;
  pendingClassName?: string;
  to?: string;
  href?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, href, ...props }, ref) => {
    const { url } = usePage();
    const targetUrl = to || href || "#";
    const isActive = new URL(url || "/", window.location.origin).pathname === targetUrl;
    const isPending = false;

    return (
      <Link
        href={targetUrl}
        className={typeof className === 'function' ? className({ isActive, isPending }) : cn(className, isActive && activeClassName, isPending && pendingClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export default NavLink;
export { NavLink };
