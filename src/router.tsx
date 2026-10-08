import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  redirect,
  type RouteComponent,
} from "@tanstack/react-router";
import { activateLocale } from "./i18n-core";
import {
  homeTarget,
  localeFromPath,
  PAGES,
  type Locale,
  type TabPage,
} from "./lib/routeTable";
import { DefaultError } from "./routes/DefaultError";
import { RootLayout } from "./routes/RootLayout";
import { RoutePending } from "./routes/RoutePending";

const COMPONENTS: Record<TabPage["key"], RouteComponent> = {
  citizenSlice: lazyRouteComponent(
    () => import("./routes/CitizenSlice"),
    "CitizenSlice"
  ),
  nationalBalance: lazyRouteComponent(
    () => import("./routes/NationalBalance"),
    "NationalBalance"
  ),
  companies: lazyRouteComponent(
    () => import("./routes/CompaniiDeStat"),
    "CompaniiDeStat"
  ),
  economy: lazyRouteComponent(() => import("./routes/Economie"), "Economie"),
  society: lazyRouteComponent(() => import("./routes/Societate"), "Societate"),
  energy: lazyRouteComponent(() => import("./routes/Energie"), "Energie"),
  labour: lazyRouteComponent(
    () => import("./routes/PiataMuncii"),
    "PiataMuncii"
  ),
  justice: lazyRouteComponent(() => import("./routes/Justitie"), "Justitie"),
};

const rootRoute = createRootRoute({
  component: RootLayout,
  errorComponent: DefaultError,
  notFoundComponent: DefaultError,
  beforeLoad: ({ location }) => {
    activateLocale(localeFromPath(location.pathname));
  },
});

function pageRoutes(locale: Locale) {
  return PAGES.map((page) =>
    page.key === "home"
      ? createRoute({
          getParentRoute: () => rootRoute,
          path: page[locale],
          beforeLoad: () => {
            throw redirect({ to: homeTarget(locale) });
          },
        })
      : createRoute({
          getParentRoute: () => rootRoute,
          path: page[locale],
          component: COMPONENTS[page.key],
        })
  );
}

const routeTree = rootRoute.addChildren([
  ...pageRoutes("en"),
  ...pageRoutes("ro"),
]);

export const router = createRouter({
  routeTree,
  trailingSlash: "always",
  defaultPendingComponent: RoutePending,
  defaultPendingMs: 150,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
