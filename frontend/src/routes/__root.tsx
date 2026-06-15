import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppProviders } from "../app/AppProviders";

function NotFoundComponent() {
  return (
    <div className="error-page">
      <div className="error-page__inner">
        <h1 className="error-page__title">404</h1>
        <h2 className="error-page__heading">Page not found</h2>
        <p className="error-page__body">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="error-page__actions">
          <Link to="/" className="error-page__btn error-page__btn--primary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="error-page">
      <div className="error-page__inner">
        <h1 className="error-page__heading">This page didn&apos;t load</h1>
        <p className="error-page__body">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="error-page__actions">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="error-page__btn error-page__btn--primary"
          >
            Try again
          </button>
          <a href="/" className="error-page__btn error-page__btn--secondary">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Social Spark" },
      { name: "description", content: "A mini social post application" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <Outlet />
      </AppProviders>
    </QueryClientProvider>
  );
}
