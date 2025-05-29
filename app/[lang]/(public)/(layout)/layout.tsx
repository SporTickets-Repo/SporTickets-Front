import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function PublicLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <>
      <Header
        logoImage="/assets/logos/Logo-Horizontal-para-fundo-Branco.png"
        dictionary={dictionary}
      />
      <div className="flex-1 flex flex-col min-h-[calc(100vh_-_81px)] overflow-x-hidden pt-[100px]">
        {children}
      </div>
      <Footer />
    </>
  );
}
