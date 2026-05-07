import { Link, usePage } from "@inertiajs/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbEntry {
  label: string;
  href?: string;
}

export function AppBreadcrumb() {
  const { url } = usePage();
  const location = new URL(url || "/", window.location.origin);
  const searchParams = location.searchParams;
  const path = location.pathname;
  const pathParts = path.split('/');

  let projectId = searchParams.get("project") || "";
  if (path.startsWith("/management/") || path.match(/^\/projects\/[^/]+\/(blocs|tranches)/)) {
      projectId = pathParts[2]; // extracting ID from route
  }

  const projectName = searchParams.get("name") || "Project";
  const companyId = searchParams.get("company") || "";
  const companyName = searchParams.get("companyName") || "Company";
  const trancheId = searchParams.get("tranche") || "";
  const trancheName = searchParams.get("trancheName") || "Tranche";
  const blocId = searchParams.get("bloc") || "";
  const blocName = searchParams.get("blocName") || "Bloc";

  const crumbs: BreadcrumbEntry[] = [];

  const companyQuery = companyId ? `?company=${companyId}&companyName=${encodeURIComponent(companyName)}` : "";
  const projectQuery = projectId ? `project=${projectId}&name=${encodeURIComponent(projectName)}` : "";
  const trancheQuery = trancheId ? `&tranche=${trancheId}&trancheName=${encodeURIComponent(trancheName)}` : "";
  const blocQuery = blocId ? `&bloc=${blocId}&blocName=${encodeURIComponent(blocName)}` : "";
  const companyQueryAmp = companyId ? `&company=${companyId}&companyName=${encodeURIComponent(companyName)}` : "";

  const tranchesHref = `/tranches?${projectQuery}${companyQueryAmp}`;
  const blocsHref = `/blocs?${projectQuery}${companyQueryAmp}${trancheQuery}`;
  const pmHref = `/project-management?${projectQuery}${companyQueryAmp}${trancheQuery}${blocQuery}`;

  if (path === "/dashboard") {
    crumbs.push({ label: "Dashboard" });
  } else if (path === "/companies") {
    crumbs.push({ label: "Companies" });
  } else if (path === "/projects") {
    crumbs.push({ label: "Companies", href: "/companies" });
    if (companyName && companyId) {
      crumbs.push({ label: decodeURIComponent(companyName) });
    } else {
      crumbs.push({ label: "Projects" });
    }
  } else if (path === "/tranches" || path.match(/^\/projects\/[^/]+\/tranches/)) {
    crumbs.push({ label: "Companies", href: "/companies" });
    if (companyId) {
      crumbs.push({ label: decodeURIComponent(companyName), href: `/projects${companyQuery}` });
    } else {
      crumbs.push({ label: "Projects", href: "/projects" });
    }
    crumbs.push({ label: decodeURIComponent(projectName) });
  } else if (path === "/blocs" || path.match(/^\/projects\/[^/]+\/blocs/)) {
    crumbs.push({ label: "Companies", href: "/companies" });
    if (companyId) {
      crumbs.push({ label: decodeURIComponent(companyName), href: `/projects${companyQuery}` });
    } else {
      crumbs.push({ label: "Projects", href: "/projects" });
    }
    crumbs.push({ label: decodeURIComponent(projectName), href: tranchesHref });
    crumbs.push({ label: decodeURIComponent(trancheName) });
  } else if (path === "/project-management" || path.startsWith("/management/")) {
    crumbs.push({ label: "Companies", href: "/companies" });
    if (companyId) {
      crumbs.push({ label: decodeURIComponent(companyName), href: `/projects${companyQuery}` });
    } else {
      crumbs.push({ label: "Projects", href: "/projects" });
    }
    crumbs.push({ label: decodeURIComponent(projectName), href: tranchesHref });
    if (trancheId) {
      crumbs.push({ label: decodeURIComponent(trancheName), href: blocsHref });
    }
    if (blocId) {
      crumbs.push({ label: decodeURIComponent(blocName) });
    }
  } else if (path === "/property-types") {
    crumbs.push({ label: "Companies", href: "/companies" });
    if (companyId) {
      crumbs.push({ label: decodeURIComponent(companyName), href: `/projects${companyQuery}` });
    } else {
      crumbs.push({ label: "Projects", href: "/projects" });
    }
    if (projectId) {
      crumbs.push({ label: decodeURIComponent(projectName), href: tranchesHref });
      if (trancheId) crumbs.push({ label: decodeURIComponent(trancheName), href: blocsHref });
      if (blocId) crumbs.push({ label: decodeURIComponent(blocName), href: pmHref });
    }
    crumbs.push({ label: "Property Types" });
  } else if (path === "/properties") {
    crumbs.push({ label: "Companies", href: "/companies" });
    if (companyId) {
      crumbs.push({ label: decodeURIComponent(companyName), href: `/projects${companyQuery}` });
    } else {
      crumbs.push({ label: "Projects", href: "/projects" });
    }
    if (projectId) {
      crumbs.push({ label: decodeURIComponent(projectName), href: tranchesHref });
      if (trancheId) crumbs.push({ label: decodeURIComponent(trancheName), href: blocsHref });
      if (blocId) crumbs.push({ label: decodeURIComponent(blocName), href: pmHref });
      crumbs.push({
        label: "Property Types",
        href: `/property-types?${projectQuery}${companyQueryAmp}${trancheQuery}${blocQuery}`,
      });
    }
    crumbs.push({ label: "Properties" });
  } else if (path === "/settings") {
    crumbs.push({ label: "Settings" });
  } else if (path === "/settings/property-types") {
    crumbs.push({ label: "Settings", href: "/settings" });
    crumbs.push({ label: "Property Types" });
  } else if (path === "/settings/profiles") {
    crumbs.push({ label: "Settings", href: "/settings" });
    crumbs.push({ label: "Profiles & Roles" });
  } else if (path === "/settings/profiles/create") {
    crumbs.push({ label: "Settings", href: "/settings" });
    crumbs.push({ label: "Profiles & Roles", href: "/settings/profiles" });
    crumbs.push({ label: "Create Role" });
  } else if (path.startsWith("/settings/profiles/edit/")) {
    crumbs.push({ label: "Settings", href: "/settings" });
    crumbs.push({ label: "Profiles & Roles", href: "/settings/profiles" });
    crumbs.push({ label: "Edit Role" });
  } else if (path === "/settings/users") {
    crumbs.push({ label: "Settings", href: "/settings" });
    crumbs.push({ label: "Users" });
  } else if (path === "/history") {
    crumbs.push({ label: "Settings", href: "/settings" });
    crumbs.push({ label: "Activity History" });
  } else if (path === "/news") {
    crumbs.push({ label: "News" });
  }

  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <span key={index} className="inline-flex items-center gap-1.5 sm:gap-2.5">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href || "#"}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
