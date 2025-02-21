import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-64">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Image
              width={1500}
              height={267}
              src="/assets/logos/Logo-Horizontal-para-fundo-Branco.png"
              alt="SporTickets"
              className="h-12 w-auto"
            />
            <p className="text-md text-muted-foreground">
              Lorem ipsum dolor sit amet. Non dolores suscipit est
              necessitatibus minima sed quis eligendi ut optio totam ut
              similique enim. Eos iure totam non repudiandae iure vel quis
              dolores
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Links Column */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/sobre-nos"
                    className="text-md text-muted-foreground hover:text-foreground"
                  >
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contato"
                    className="text-md text-muted-foreground hover:text-foreground"
                  >
                    Contato
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-md text-muted-foreground hover:text-foreground"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Column */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">Social</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://twitter.com"
                    className="text-md text-muted-foreground hover:text-foreground"
                  >
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://facebook.com"
                    className="text-md text-muted-foreground hover:text-foreground"
                  >
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://instagram.com"
                    className="text-md text-muted-foreground hover:text-foreground"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://tiktok.com"
                    className="text-md text-muted-foreground hover:text-foreground"
                  >
                    Tiktok
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="">
              <h3 className="mb-4 text-xl font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/termos"
                    className="text-md text-muted-foreground hover:text-foreground"
                  >
                    Termos de uso
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacidade"
                    className="text-md text-muted-foreground hover:text-foreground"
                  >
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-md text-muted-foreground hover:text-foreground"
                  >
                    Política de Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <div className="text-center text-sm text-muted-foreground py-6 bg-[#FAFAFA]">
        © {new Date().getFullYear()} Sport Tickets. Todos os direitos reservados
      </div>
    </footer>
  );
}
