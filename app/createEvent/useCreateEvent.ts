"use client"
import { useState } from "react";

export default function useCreateEvent() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nome, descricao });
  };

  return {
    nome,
    setNome,
    descricao,
    setDescricao,
    handleSubmit
  };
}