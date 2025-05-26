"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

import { Calendar, Star, Trophy, Users } from "lucide-react";

const stats = [
  { number: "15,000+", label: "Usuarios ativos", icon: Users },
  { number: "500+", label: "Eventos realizados", icon: Calendar },
  { number: "90,000+", label: "Ingressos emitidos", icon: Trophy },
  { number: "200,000+", label: "Acessos mensais", icon: Calendar },
];

const testimonials = [
  {
    name: "Carlos Eduardo",
    date: "15 de Mar, 2025",
    rating: 5,
    comment:
      "Como gestor de eventos, a Sportickets transformou nossa maneira de trabalhar. A plataforma é intuitiva, segura e facilita muito o controle de ingressos.",
    avatar:
      "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1",
  },
  {
    name: "Rafael Gomes",
    date: "22 de Mar, 2025",
    rating: 5,
    comment:
      "A eficiência da Sportickets nos permite organizar eventos sem complicações. A tecnologia é moderna e o suporte é sempre rápido e eficaz.",
    avatar:
      "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1",
  },
  {
    name: "Bruno Oliveira",
    date: "05 de Abr, 2025",
    rating: 5,
    comment:
      "Utilizar a Sportickets fez toda a diferença para nossa equipe. Agora, gerenciar vendas e acessos se tornou um processo ágil e confiável.",
    avatar:
      "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1",
  },
  {
    name: "Marcos Pereira",
    date: "18 de Abr, 2025",
    rating: 5,
    comment:
      "A plataforma da Sportickets é essencial para o nosso sucesso. Confiabilidade, praticidade e tecnologia de ponta são evidentes em cada detalhe.",
    avatar:
      "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1",
  },
];

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="max-w-7xl mx-auto md:px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Sobre Nós
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Somos a ponte entre organizadores e apaixonados por esportes.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2">
          <div className="relative h-[498px] rounded-2xl overflow-hidden">
            <Image
              src="assets/images/quadra.png"
              alt="Basketball court"
              className="object-cover w-full h-full"
              unoptimized
              width={498}
              height={498}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="relative h-[245px] rounded-2xl overflow-hidden ">
              <Image
                src="assets/images/ball.png"
                alt="Running track"
                className="object-cover w-full h-full"
                unoptimized
                width={245}
                height={245}
              />
            </div>
            <div className="relative h-[245px] rounded-2xl overflow-hidden ">
              <Image
                src="assets/images/run.png"
                alt="Running track"
                className="object-cover w-full h-full"
                unoptimized
                width={245}
                height={245}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-start  mb-5">Nossa missão</h2>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-12">
            <div className="flex flex-col gap-4 items-start">
              <p className="text-gray-800   ">
                Na SporTickets, acreditamos no poder do esporte para conectar
                pessoas e transformar vidas. Nossa missão é facilitar a
                organização e participação em eventos esportivos por meio de
                tecnologia acessível e intuitiva, impulsionando o crescimento do
                esporte em todas as regiões do Brasil.
              </p>
              <p className="text-gray-600   ">
                Queremos que cada organizador, atleta e torcedor viva o esporte
                de forma leve, profissional e sem complicações.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="border-l-4 pl-4 border-sporticket-orange flex flex-col justify-center"
                >
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-12">
            <a href="https://wa.me/5561996476207">
              <Button
                variant="secondary"
                className="px-10 md:px-40 w-full md:w-auto"
              >
                Começar agora
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-2">
          <h2 className="text-3xl font-bold mb-4">Para organizadores</h2>
          <p className="text-gray-800 text-md ">
            Nossa plataforma foi criada pensando em você, organizador! Com
            ferramentas completas para gerenciamento de ingressos, divulgação e
            controle de acesso, facilitamos cada etapa do seu evento, do início
            ao fim.
          </p>
          <p className="text-gray-500 text-md">
            Venda sem complicação, controle total, segurança garantida e alcance
            mais pessoas.
          </p>

          <div className="relative w-full mt-4 flex items-center justify-center py-16">
            <Image
              src="/assets/backgrounds/mapGlobe.png"
              alt="globe"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 w-full h-full"
              unoptimized
            />
            <div className="relative p-4 w-[50vw] text-center text-gray-900 border border-black rounded-xl backdrop-blur-sm ">
              <p>
                "Acreditamos no esporte como agente de transformação. Nossa
                tecnologia é o alicerce que conecta sonhos a realizações."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold  mb-12">
            O que os nossos clientes estão dizendo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-4 border-none bg-gray-50">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="aspect-w-1 aspect-h-1">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="object-cover"
                    />
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm">{testimonial.comment}</p>
                <div className="text-sm text-gray-500 mt-4">
                  {testimonial.date}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-black/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Faça parte da melhor plataforma de eventos do Brasil
          </h2>
          <p className="mb-8 text-gray-300">
            Junte-se a mais de 500 empresas que já estão crescendo conosco
          </p>
          <a href="https://wa.me/5561996476207">
            <Button size="lg" variant="secondary">
              Começar agora
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
