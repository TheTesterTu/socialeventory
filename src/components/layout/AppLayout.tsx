
import { useIsMobile } from "@/hooks/use-mobile";
import { TopBar } from "@/components/TopBar";
import { SideNav } from "@/components/navigation/SideNav";
import { BottomNav } from "@/components/navigation/BottomNav";
import { FloatingActions } from "@/components/navigation/FloatingActions";
import { Footer } from "./Footer";
import { PropsWithChildren } from "react";

interface AppLayoutProps extends PropsWithChildren {
  hideTopBar?: boolean;
  hideFooter?: boolean;
}

export const AppLayout = ({ 
  children, 
  hideTopBar = false,
  hideFooter = false
}: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      {!hideTopBar && <TopBar />}
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>
      {!hideFooter && <Footer />}
      {isMobile && (
        <>
          <BottomNav />
          <FloatingActions />
        </>
      )}
    </div>
  );
};
