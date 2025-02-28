"use client";

import { Button } from "@/components/ui/button";

export default function UserPage() {
  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-4">Perfil de Usuário</h1>
      <p>Esta é a tela do perfil do usuário.</p>
      <Button className="mt-4">Editar Perfil</Button>
    </div>
  );
}
