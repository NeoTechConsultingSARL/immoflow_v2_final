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

interface AppBreadcrumbProps {
  contractPath?: string;
  hierarchyData?: {
    companyId?: number;
    companyName?: string;
    projectId?: number;
    projectName?: string;
    trancheId?: number;
    trancheName?: string;
    blocId?: number;
    blocName?: string;
  };
}

export function AppBreadcrumb({ contractPath, hierarchyData }: AppBreadcrumbProps = {}) {
  const { url, props } = usePage();
  const location = new URL(url || "/", window.location.origin);
  const searchParams = location.searchParams;
  const path = location.pathname;

  const propertyPath = contractPath || (props as any)?.path || '';
  const data = hierarchyData || (props as any)?.hierarchyData || {};

  const projectId = searchParams.get("project") || "";
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
  } else if (path === "/tranches") {
    crumbs.push({ label: "Companies", href: "/companies" });
    if (companyId) {
      crumbs.push({ label: decodeURIComponent(companyName), href: `/projects${companyQuery}` });
    } else {
      crumbs.push({ label: "Projects", href: "/projects" });
    }
    crumbs.push({ label: decodeURIComponent(projectName) });
  } else if (path === "/blocs" || path.match(/^\/projects\/\d+\/blocs$/)) {
    crumbs.push({ label: "Companies", href: "/companies" });
    if (companyId) {
      crumbs.push({ label: decodeURIComponent(companyName), href: `/projects${companyQuery}` });
    } else {
      crumbs.push({ label: "Projects", href: "/projects" });
    }
    if (projectId) {
      crumbs.push({ label: decodeURIComponent(projectName), href: tranchesHref });
    }
    if (trancheId) {
      crumbs.push({ label: decodeURIComponent(trancheName) });
    }
  } else if (path === "/project-management" || path.match(/^\/management\/\d+$/)) {
    crumbs.push({ label: "Companies", href: "/companies" });
    if (companyId) {
      crumbs.push({ label: decodeURIComponent(companyName), href: `/projects${companyQuery}` });
    } else {
      crumbs.push({ label: "Projects", href: "/projects" });
    }
    if (projectId) {
      crumbs.push({ label: decodeURIComponent(projectName), href: tranchesHref });
    }
    if (trancheId) {
      crumbs.push({ label: decodeURIComponent(trancheName), href: blocsHref });
    }
    if (blocId) {
      crumbs.push({ label: decodeURIComponent(blocName), href: pmHref });
    }
    crumbs.push({ label: "Management" });
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

  } else if (path === "/client-contracts" || path === "/contract-details" || path === "/contract-create" || path.match(/^\/contracts\/\d+\/edit$/) || path.match(/^\/blocs\/\d+\/contracts\/\d+\/edit$/)) {

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
    if (path === "/contract-details") {
      const search = location.search || "";
      crumbs.push({ label: "Clients & Contracts", href: `/client-contracts${search.replace(/[?&]id=[^&]*/, "")}` });
      const ref = searchParams.get("ref") || "Contract";
      crumbs.push({ label: decodeURIComponent(ref) });
    } else if (path === "/contract-create") {
      const search = location.search || "";
      crumbs.push({ label: "Clients & Contracts", href: `/client-contracts${search}` });
      crumbs.push({ label: "New Contract" });

    } else if (path.match(/^\/contracts\/\d+\/edit$/) || path.match(/^\/blocs\/\d+\/contracts\/\d+\/edit$/)) {
      const search = location.search || "";
      crumbs.push({ label: "Clients & Contracts", href: `/client-contracts${search}` });
      crumbs.push({ label: "Edit Contract" });

    } else {
      crumbs.push({ label: "Clients & Contracts" });
    }
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
  } else if (path === "/settings/contract-articles") {
    crumbs.push({ label: "Settings", href: "/settings" });
    crumbs.push({ label: "Contract Articles" });
  } else if (path === "/history") {
    crumbs.push({ label: "Settings", href: "/settings" });
    crumbs.push({ label: "Activity History" });
  } else if (path === "/news") {
    crumbs.push({ label: "News" });
  } else if (path === "/parkings") {
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
    crumbs.push({ label: "Parking" });
  } else if (path.match(/^\/blocs\/\d+\/contracts$/)) {
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
    crumbs.push({ label: "Contracts" });
  } else if (path.match(/^\/blocs\/\d+\/contracts\/\d+$/)) {
    // Use property hierarchy from contract if available
    if (propertyPath && data.companyId) {
      const hierarchyParts = propertyPath.split(' > ');
      const { companyId, companyName, projectId, projectName, trancheId, trancheName, blocId, blocName } = data;

      // Company
      if (companyName) {
        crumbs.push({ label: companyName, href: `/companies` });
      }
      // Project
      if (projectName && companyId) {
        crumbs.push({ label: projectName, href: `/projects?company=${companyId}&companyName=${encodeURIComponent(companyName)}` });
      }
      // Tranche
      if (trancheName && projectId) {
        crumbs.push({ label: trancheName, href: `/tranches?project=${projectId}&name=${encodeURIComponent(projectName)}&company=${companyId}&companyName=${encodeURIComponent(companyName)}` });
      }
      // Bloc
      if (blocName && trancheId) {
        crumbs.push({ label: blocName, href: `/blocs?project=${projectId}&name=${encodeURIComponent(projectName)}&company=${companyId}&companyName=${encodeURIComponent(companyName)}&tranche=${trancheId}&trancheName=${encodeURIComponent(trancheName)}` });
      }
      // Property (last part of hierarchy before Contracts)
      if (hierarchyParts.length > 4) {
        const propertyName = hierarchyParts[4];
        crumbs.push({ label: propertyName });
      }
      // Contracts link
      if (blocId) {
        const contractsQuery = new URLSearchParams();
        if (companyId) contractsQuery.set('company', companyId.toString());
        if (companyName) contractsQuery.set('companyName', companyName);
        if (projectId) contractsQuery.set('project', projectId.toString());
        if (projectName) contractsQuery.set('name', projectName);
        if (trancheId) contractsQuery.set('tranche', trancheId.toString());
        if (trancheName) contractsQuery.set('trancheName', trancheName);
        if (blocName) contractsQuery.set('blocName', blocName);
        crumbs.push({ label: "Contracts", href: `/blocs/${blocId}/contracts${contractsQuery.toString() ? '?' + contractsQuery.toString() : ''}` });
      } else {
        crumbs.push({ label: "Contracts" });
      }
      crumbs.push({ label: "Details" });
    } else {
      // Fallback to URL parameters
      crumbs.push({ label: "Companies", href: "/companies" });
      if (companyId) {
        crumbs.push({ label: decodeURIComponent(companyName), href: `/projects${companyQuery}` });
      } else {
        crumbs.push({ label: "Projects", href: "/projects" });
      }
      if (projectId) {
        crumbs.push({ label: decodeURIComponent(projectName), href: tranchesHref });
        if (trancheId) crumbs.push({ label: decodeURIComponent(trancheName), href: blocsHref });
        if (blocId) crumbs.push({ label: decodeURIComponent(blocName), href: `/blocs/${blocId}/contracts${companyQueryAmp ? '&' + companyQueryAmp.slice(1) : ''}${trancheQuery}` });
      }
      crumbs.push({ label: "Contracts", href: `/blocs/${blocId}/contracts${companyQueryAmp ? '?' + companyQueryAmp.slice(1) : ''}${trancheQuery}${blocQuery}` });
      crumbs.push({ label: "Details" });
    }
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
