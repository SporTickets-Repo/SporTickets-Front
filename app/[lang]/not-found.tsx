import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import TranslatedLink from "@/components/translated-link";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function NotFound(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <Header
        logoImage="/assets/logos/Logo-Horizontal-para-fundo-Branco.png"
        dictionary={dictionary}
      />
      <div className="flex-1 flex flex-col min-h-[calc(100vh_-_81px)] overflow-x-hidden pt-[100px] container justify-center items-center text-center gap-4">
        <h2 className="text-sporticket-purple text-4xl font-bold">
          Página Não Encotrada!
        </h2>
        <p className="text-lg">
          Por favor, verifique o endereço digitado e tente novamente.
        </p>
        <TranslatedLink href="/">
          <Button>Voltar para a página inicial</Button>
        </TranslatedLink>
      </div>
      <Footer />
    </>
  );
}
