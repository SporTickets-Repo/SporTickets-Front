"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

import { Calendar, Star, Trophy, Users } from "lucide-react";

const stats = [
  { number: "150,000+", label: "Negócios ativos", icon: Users },
  { number: "500+", label: "Eventos realizados", icon: Calendar },
  { number: "500+", label: "Prêmios", icon: Trophy },
  { number: "500+", label: "Eventos realizados", icon: Calendar },
];

const testimonials = [
  {
    name: "Alex Smith",
    date: "10 de Fev, 2025",
    rating: 5,
    comment:
      "A compra foi super rápida e segura! Recebi meu ingresso na hora e ainda me avisou que realmente participei. Com certeza comprarei de novo!",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
  },
  {
    name: "Alex Smith",
    date: "10 de Fev, 2025",
    rating: 5,
    comment:
      "Achei sensacional a plataforma! Tudo digital, sem filas e sem risco de perder meu ingresso. Recomendo demais!",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
  },
  {
    name: "Alex Smith",
    date: "10 de Fev, 2025",
    rating: 5,
    comment:
      "A plataforma facilitou muito a venda dos ingressos. O painel é super intuitivo e pude acompanhar toda as vendas em tempo real.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
  },
  {
    name: "Alex Smith",
    date: "10 de Fev, 2025",
    rating: 5,
    comment:
      "Além do enviar os ingressos, conseguimos divulgar nosso evento para um público mais legal. Tivemos recorde de vendas!",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
  },
];

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Lorem ipsum
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet. Non dolores suscipit est necessitatibus
            minima sed quis eligendi ut quis totam ut.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-2">
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

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-start  mb-10">Nossa missão</h2>
          <div className="grid grid-cols-2 gap-12">
            <div className="flex flex-col gap-4 items-start">
              <p className="text-gray-800   ">
                Lorem ipsum dolor sit amet. Non dolores suscipit est
                necessitatibus minima sed quis eligendi ut quis totam ut. Lorem
                ipsum dolor sit amet. Non dolores suscipit est necessitatibus
                minima sed quis eligendi ut optio totam ut similique enim.
              </p>
              <p className="text-gray-600   ">
                Lorem ipsum dolor sit amet. Non dolores suscipit est
                necessitatibus minima sed quis eligendi ut optio totam ut
                similique enim.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="border-l-4 pl-4 border-orange-tertiary flex flex-col justify-center"
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
            <Button size="xl" variant="secondary">
              Começar agora
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-2">
          <h2 className="text-3xl font-bold mb-4">Para organizadores</h2>
          <p className="text-gray-800 text-md ">
            Nossa plataforma foi criada para simplificar a venda de ingressos,
            garantindo uma experiência rápida, segura e eficiente para você e
            seu público.
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
              <h1>Lorem ipsum dolor</h1>
              <p>
                Lorem ipsum dolor sit amet. Non dolores suscipit est
                necessitatibus minima sed quis eligendi ut optio totam ut
                similique enim.
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
            Faça parte da maior plataforma de eventos do Brasil
          </h2>
          <p className="mb-8 text-gray-300">
            Junte-se a mais de 500 empresas que já estão crescendo conosco
          </p>
          <Button size="lg" variant="secondary">
            Começar agora
          </Button>
        </div>
      </section>
    </div>
  );
}
