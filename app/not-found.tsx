import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Header logoImage="/assets/logos/Logo-Horizontal-para-fundo-Branco.png" />
      <div className="flex-1 flex flex-col min-h-[calc(100vh_-_81px)] overflow-x-hidden pt-[100px] container justify-center items-center text-center gap-4">
        <h2 className="text-purple-primary text-4xl font-bold">
          Página Não Encotrada!
        </h2>
        <p className="text-lg">
          Por favor, verifique o endereço digitado e tente novamente.
        </p>
        <Link href="/">
          <Button>Voltar para a página inicial</Button>
        </Link>
      </div>
      <Footer />
    </>
  );
}
