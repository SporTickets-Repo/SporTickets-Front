"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Posso transferir meu ingresso para outra pessoa?",
    answer:
      "Lorem ipsum dolor sit amet. Non dolores suscipit est necessitatibus minima sed quis eligendi ut optio totam ut similique enim.",
  },
  {
    question: "Quais são as taxas para vender ingressos do meu evento?",
    answer:
      "Lorem ipsum dolor sit amet. Non dolores suscipit est necessitatibus minima sed quis eligendi ut optio totam ut similique enim.",
  },
  {
    question: "Há um limite de ingressos que posso vender?",
    answer:
      "Lorem ipsum dolor sit amet. Non dolores suscipit est necessitatibus minima sed quis eligendi ut optio totam ut similique enim.",
  },
  {
    question:
      "Há possibilidade de reembolso caso eu não possa comparecer ao evento?",
    answer:
      "Lorem ipsum dolor sit amet. Non dolores suscipit est necessitatibus minima sed quis eligendi ut optio totam ut similique enim.",
  },
  {
    question: "Como faço para criar meu primeiro evento?",
    answer:
      "Lorem ipsum dolor sit amet. Non dolores suscipit est necessitatibus minima sed quis eligendi ut optio totam ut similique enim.",
  },
  {
    question: "Quais métodos de pagamento são aceitos?",
    answer:
      "Lorem ipsum dolor sit amet. Non dolores suscipit est necessitatibus minima sed quis eligendi ut optio totam ut similique enim.",
  },
  {
    question: "Como funciona a validação dos ingressos?",
    answer:
      "Lorem ipsum dolor sit amet. Non dolores suscipit est necessitatibus minima sed quis eligendi ut optio totam ut similique enim.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className=" py-16">
      <div className=" grid grid-cols-2 gap-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <div className="text-cyan-700 bg-cyan-500/10 rounded-full  px-3 py-1 w-16 flex items-center justify-center">
            <span className="uppercase text-md">FAQ</span>
          </div>
          <h1 className="text-3xl font-bold ">Perguntas frequentes</h1>
          <p className="text-gray-600 mb-2">
            Encontre as perguntas mais comuns dos nossos clientes.
          </p>

          <div className="relative mb-8">
            <Input
              type="text"
              placeholder="Pesquisar perguntas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="p-6">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="px-6"
              >
                <AccordionTrigger className="text-left ">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma pergunta encontrada para sua pesquisa.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
