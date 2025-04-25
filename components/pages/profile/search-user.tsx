"use client";

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
import { Player } from "@/interface/tickets";
import { userService } from "@/service/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const searchFormSchema = z.object({
  search: z.string().min(1, {
    message: "O e-mail ou CPF é obrigatório.",
  }),
});

export function SearchUser() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: { search: "" },
  });

  const handleSubmit = async (data: z.infer<typeof searchFormSchema>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.getUserByEmail(data.search);

      setUser(response);
    } catch (err) {
      setError("Usuário não encontrado");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId: string) => {
    router.push(`/usuario/${userId}`);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email ou CPF</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite o e-mail ou CPF" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Pesquisando..." : "Pesquisar"}
          </Button>
        </form>
      </Form>

      {error && (
        <div className="text-center text-destructive">
          <p>{error}</p>
        </div>
      )}

      {user && (
        <div
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleUserClick(user.userId)}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={
                  user.profileImageUrl || "/assets/icons/default-profile.png"
                }
                alt={user.name || "Usuário"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
