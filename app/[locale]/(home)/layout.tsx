import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AddToHomeScreenModal } from "@/components/pages/home/add-to-home-screen";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <AddToHomeScreenModal />
      {children}
      <Footer />
    </>
  );
}
