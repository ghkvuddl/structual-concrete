import React from "react";
import { NextRouter, useRouter } from "next/router";
import { getRouteRegex } from "next/dist/shared/lib/router/utils/route-regex";
import { getClientBuildManifest } from "next/dist/client/route-loader";
import { normalizePathTrailingSlash } from "next/dist/client/normalize-trailing-slash";
import { parseRelativeUrl } from "next/dist/shared/lib/router/utils/parse-relative-url";
import { isDynamicRoute } from "next/dist/shared/lib/router/utils/is-dynamic";
import { denormalizePagePath } from "next/dist/shared/lib/page-path/denormalize-page-path";

async function getDoesLocationMatchPage(location: string) {
  const pages = await getPageList();
  let parsed = parseRelativeUrl(location);
  let { pathname } = parsed;
  return pathMatchesPage(pathname, pages);
}

async function getPageList() {
  if (process.env.NODE_ENV === "production") {
    const { sortedPages } = await getClientBuildManifest();
    return sortedPages;
  } else {
    if (typeof window !== "undefined" && window.__DEV_PAGES_MANIFEST) {
      return window.__DEV_PAGES_MANIFEST.pages;
    }
  }
  return [];
}

function pathMatchesPage(pathname: string, pages: string[]) {
  const cleanPathname = normalizePathTrailingSlash(denormalizePagePath(pathname));
  if (pages.includes(cleanPathname)) {
    return true;
  }
  const page = pages.find((page) => isDynamicRoute(page) && getRouteRegex(page).re.test(cleanPathname));
  if (page) {
    return true;
  }
  return false;
}

function weAreLost(router: NextRouter) {
  return router.pathname !== router.asPath;
}

export default function PageNotFound() {
  const router = useRouter();
  const [isNotFound, setIsNotFound] = React.useState(false);

  const processLocationAndRedirect = async (router: NextRouter) => {
    if (weAreLost(router)) {
      const targetIsValidPage = await getDoesLocationMatchPage(router.asPath);
      if (targetIsValidPage) {
        await router.replace(router.asPath);
        return;
      }
    }
    setIsNotFound(true);
  };

  React.useEffect(() => {
    if (router.isReady) {
      processLocationAndRedirect(router);
    }
  }, [router]);

  if (!isNotFound) return null;

  return <h1>404 - Page Not Found</h1>;
}
