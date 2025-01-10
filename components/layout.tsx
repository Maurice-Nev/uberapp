"use server";

import { Navigation } from "@/features/navigation/components/navigation";
import React, { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex w-full overflow-x-hidden flex-col">
      <Navigation />
      <main className="flex-1 flex flex-col md:px-8 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
