import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AddToHomeScreenModal } from "@/components/pages/home/add-to-home-screen";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function HomeLayout({
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
      <Header dictionary={dictionary} />
      <AddToHomeScreenModal />
      {children}
      <Footer />
    </>
  );
}
