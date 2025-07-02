
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppLayout } from "./AppLayout";
import { PropsWithChildren } from "react";

interface AppLayoutWithBoundaryProps extends PropsWithChildren {
  hideTopBar?: boolean;
  hideFooter?: boolean;
  showTopBar?: boolean;
  pageTitle?: string;
  pageDescription?: string;
}

export const AppLayoutWithBoundary = (props: AppLayoutWithBoundaryProps) => {
  return (
    <ErrorBoundary>
      <div data-error-boundary="true">
        <AppLayout {...props} />
      </div>
    </ErrorBoundary>
  );
};
