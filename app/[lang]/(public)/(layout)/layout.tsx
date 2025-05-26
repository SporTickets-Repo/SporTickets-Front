import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header logoImage="/assets/logos/Logo-Horizontal-para-fundo-Branco.png" />
      <div className="flex-1 flex flex-col min-h-[calc(100vh_-_81px)] overflow-x-hidden pt-[100px]">
        {children}
      </div>
      <Footer />
    </>
  );
}
