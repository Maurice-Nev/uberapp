"use client";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/features/auth/components/authButton";
import { CarTaxiFront, Menu, X } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { FC, HTMLProps, useState } from "react";
import { usePathname } from "next/navigation";

interface MobileMenuProps extends HTMLProps<HTMLDivElement> {}

export const MobileMenu: FC<MobileMenuProps> = ({ ...rest }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      {...rest}
      className="w-full fixed top-0  right-0 md:hidden z-40 bg-background"
    >
      <div className="flex justify-between px-8 py-4 items-center border-b">
        {/* Linkes Icon */}
        <CarTaxiFront
          className="w-8 h-8 cursor-pointer"
          onClick={() => redirect("/")}
        />

        {/* Menü-Button rechts */}
        {isMenuOpen ? (
          <X className="w-8 h-8" onClick={() => setIsMenuOpen(!isMenuOpen)} />
        ) : (
          <Menu
            className="w-8 h-8"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        )}
      </div>

      {/* Dropdown-Menü über volle Breite mit Animation */}
      <div
        className={`${
          isMenuOpen ? "max-h-screen " : "max-h-0"
        } overflow-hidden border-b transition-[max-height] duration-300 ease-in-out w-full border-t`}
      >
        <ul className="flex flex-col items-center gap-4 py-4 px-6">
          <li
            className={`font-semibold ${
              pathname === "/" ? "text-indigo-600" : ""
            }`}
          >
            <Link href="/">Home</Link>
          </li>
          <li
            className={`font-semibold ${
              pathname === "/booking" ? "text-indigo-600" : ""
            }`}
          >
            <Link href="/booking">Booking</Link>
          </li>
          <li
            className={`font-semibold ${
              pathname === "/my-rides" ? "text-indigo-600" : ""
            }`}
          >
            <Link href="/my-rides">My rides</Link>
          </li>
          <li
            className={`font-semibold ${
              pathname === "/offer-ride" ? "text-indigo-600" : ""
            }`}
          >
            <Link href="/offer-ride">Offer a ride</Link>
          </li>
          {/* <li
            className={`font-semibold ${
              pathname === "/support" ? "text-indigo-600" : ""
            }`}
          >
            <Link href="/support">Support</Link>
          </li> */}
          <li className="mt-4">
            <AuthButton variant="outline" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
