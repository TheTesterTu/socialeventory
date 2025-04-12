
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileLayout } from "./MobileLayout";
import { DesktopLayout } from "./DesktopLayout";

interface AppLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  showTopBar?: boolean;
}

export const AppLayout = ({
  children,
  pageTitle,
  pageDescription,
  showTopBar = true
}: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-background to-background/95 -z-10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#8B5CF6_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_#06B6D4_0%,_transparent_30%)]" />
        </div>
      </div>
      
      {isMobile ? (
        <MobileLayout pageTitle={pageTitle} showTopBar={showTopBar}>
          {children}
        </MobileLayout>
      ) : (
        <DesktopLayout pageTitle={pageTitle} pageDescription={pageDescription} showTopBar={showTopBar}>
          {children}
        </DesktopLayout>
      )}
    </div>
  );
};
