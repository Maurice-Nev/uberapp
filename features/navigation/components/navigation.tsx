import React from "react";
import { DesktopMenu } from "./desktopMenu";
import { MobileMenu } from "./mobileMenu";

export const Navigation = () => {
  return (
    <div>
      <DesktopMenu className="md:block hidden" />
      <MobileMenu className="md:hidden block" />
    </div>
  );
};
