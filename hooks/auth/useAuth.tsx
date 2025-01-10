"use client";
import {
  getUserAction,
  getUserById,
  signInAction,
  signUpAction,
} from "@/actions/auth/authAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { checkSession } from "../../actions/auth/checkSession";

export const useSignUp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["signUp"],
    mutationFn: async (data: any) => {
      const response = await signUpAction(data);

      // Speichert den Token nur, wenn die Registrierung erfolgreich war
      if (response.token) {
        Cookies.set("sessionToken", response.token, {
          expires: 1,
          sameSite: "Strict",
        });
      }
      return response;
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
    onSuccess: (response) => {
      // Nur weiterleiten, wenn ein Token vorhanden ist
      if (response.token) {
        queryClient.invalidateQueries({ queryKey: ["checkSession"] });
        router.push("/");
      }
    },
  });

  return mutation;
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ["signIn"],
    mutationFn: async (data: any) => {
      const response = await signInAction(data);

      // Überprüfen, ob das Token vorhanden ist, bevor es im Cookie gespeichert wird
      if (response.token) {
        Cookies.set("sessionToken", response.token, {
          expires: 1,
          sameSite: "Strict",
        }); // Token im Cookie speichern
      }
      return response;
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
    onSuccess: (response) => {
      // Nur weiterleiten, wenn ein Token zurückgegeben wurde
      if (response.token) {
        queryClient.invalidateQueries({ queryKey: ["checkSession"] });
        router.push("/");
      }
    },
  });

  return mutation;
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleLogout = () => {
    Cookies.remove("sessionToken"); // sessionToken-Cookie löschen
    queryClient.invalidateQueries({ queryKey: ["checkSession"] });
    router.push("/auth"); // Weiterleitung zur Login-Seite oder beliebiger Route
  };

  return handleLogout;
};

export const useCheckSession = () => {
  const query = useQuery<boolean>({
    queryKey: ["checkSession"],
    queryFn: async () => {
      const result = await checkSession();
      return result;
    },
    staleTime: 1000 * 60 * 5, // Optional: 5 Minuten Cache-Zeit für die Session-Daten
    retry: false, // Optional: Keine Wiederholungen bei Fehler
  });
  return query;
};

export const useGetUser = () => {
  const query = useQuery({
    queryKey: ["getUser"], // queryKey enthält sessionId als Teil des Schlüssels
    queryFn: async () => {
      // queryFn erwartet keine Argumente
      const user = await getUserAction();
      return user;
    },
  });
  return query;
};

export const useGetUserByIds = ({ user_id }: { user_id: string }) => {
  const query = useQuery({
    queryKey: ["getUserById", user_id],
    queryFn: async () => {
      const res = await getUserById({ user_id });
      return res;
    },
  });
  return query;
};
