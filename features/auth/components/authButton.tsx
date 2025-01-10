"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCheckSession, useLogout } from "@/hooks/auth/useAuth";
import { redirect } from "next/navigation";
import React from "react";
// Direkt als Action importieren

interface AuthButtonProps extends Omit<ButtonProps, "onClick"> {}

export const AuthButton: React.FC<AuthButtonProps> = ({ ...rest }) => {
  const logout = useLogout(); // Ausloggen

  // Verwende React Query, um die `checkSession`-Action abzurufen
  const { data: sessionIsValid, isLoading } = useCheckSession();

  function login() {
    redirect("/auth");
  }
  if (isLoading) {
    return (
      <Button disabled {...rest}>
        <Skeleton className="h-5 w-11" />
      </Button>
    );
  }

  return (
    <Button {...rest} onClick={sessionIsValid ? logout : login}>
      {sessionIsValid ? "Logout" : "Login"}
    </Button>
  );
};
