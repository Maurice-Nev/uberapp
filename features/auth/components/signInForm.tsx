"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@/hooks/auth/useAuth";

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export function SignInForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutate: signInMutation, isPending: isLoading } = useSignIn();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    signInMutation(data, {
      onSuccess: (result) => {
        if (result.error) {
          // Zeigt die Fehlermeldung an, wenn die Anmeldung fehlschlägt
          toast({
            title: "Fehler",
            description: result.error,
          });
        } else {
          // Bei erfolgreicher Anmeldung
          toast({
            title: "Login erfolgreich!",
            description: "Session-Token wurde gespeichert.",
          });
          // Hier kannst du die Weiterleitung oder weitere Aktionen hinzufügen
        }
      },
      onError: (error) => {
        // Zeigt eine generelle Fehlermeldung an, falls ein unerwarteter Fehler auftritt
        toast({
          title: "Fehler",
          description: "Anmeldung fehlgeschlagen.",
        });
      },
    });
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="user@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isLoading ? (
            <Button disabled type="submit">
              Loading...
            </Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </form>
      </Form>
    </div>
  );
}
