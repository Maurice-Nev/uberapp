"use client";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/features/auth/components/authButton";
import { CarTaxiFront } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { FC, HTMLProps } from "react";
import { usePathname } from "next/navigation"; // Importiere usePathname

interface DesktopMenuProps extends HTMLProps<HTMLDivElement> {}

export const DesktopMenu: FC<DesktopMenuProps> = ({ ...rest }) => {
  const pathname = usePathname(); // Hole den aktuellen Pfad

  return (
    <div {...rest}>
      <div className="flex justify-between px-8 border-b py-4 items-center">
        <CarTaxiFront className="w-8 h-8" onClick={() => redirect("/")} />
        <ul className="flex gap-16">
          <li
            className={`font-semibold ${
              pathname === "/" ? "text-primary" : ""
            }`}
          >
            <Link href="/">Home</Link>
          </li>
          <li
            className={`font-semibold ${
              pathname === "/booking" ? "text-primary" : ""
            }`}
          >
            <Link href="/booking">Booking</Link>
          </li>
          <li
            className={`font-semibold ${
              pathname === "/my-rides" ? "text-primary" : ""
            }`}
          >
            <Link href="/my-rides">My rides</Link>
          </li>
          <li
            className={`font-semibold ${
              pathname === "/offer-ride" ? "text-primary" : ""
            }`}
          >
            <Link href="/offer-ride">Offer a ride</Link>
          </li>
          {/* <li
            className={`font-semibold ${
              pathname === "/support" ? "text-primary" : ""
            }`}
          >
            <Link href="/support">Support</Link>
          </li> */}
        </ul>
        <div className="flex">
          <AuthButton variant="outline" />
        </div>
      </div>
    </div>
  );
};

export default DesktopMenu;
