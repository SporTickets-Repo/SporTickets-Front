"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const couponSchema = z.object({
  code: z.string().min(1, "Código do cupom é obrigatório"),
});

interface CouponDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (code: string) => void;
}

export function CouponDialog({ open, onClose, onApply }: CouponDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof couponSchema>>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof couponSchema>) => {
    setLoading(true);
    try {
      // Here you would validate the coupon with your backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onApply(data.code);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center mb-4">
          <DialogTitle>Adicionar Cupom</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código do Cupom</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o código" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Validando..." : "Aplicar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
