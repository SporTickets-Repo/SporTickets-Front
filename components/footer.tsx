import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import TranslatedLink from "./translated-link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-8 md:py-12">
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
            <p className="text-sm md:text-md text-muted-foreground">
              Venda de ingressos e gestão de eventos esportivos em um só lugar.
              Simples, rápido e feito para quem vive o esporte.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Links Column */}
            <div>
              <h3 className="md:mb-4 mb-2 text-md md:text-xl font-semibold">
                Links
              </h3>
              <ul className="space-y-1">
                <li>
                  <TranslatedLink
                    href="/sobre"
                    className="text-sm md:text-md text-muted-foreground hover:text-foreground"
                  >
                    Fazer evento
                  </TranslatedLink>
                </li>
                <li>
                  <TranslatedLink
                    href="https://wa.me/5561996476207"
                    className="text-sm md:text-md text-muted-foreground hover:text-foreground"
                  >
                    Suporte
                  </TranslatedLink>
                </li>
                <li>
                  <TranslatedLink
                    href="/suporte"
                    className="text-sm md:text-md text-muted-foreground hover:text-foreground"
                  >
                    FAQ
                  </TranslatedLink>
                </li>
              </ul>
            </div>

            {/* Social Column */}
            <div>
              <h3 className="md:mb-4 mb-2 text-md md:text-xl font-semibold">
                Social
              </h3>
              <ul className="space-y-1">
                <li>
                  <TranslatedLink
                    href="https://www.instagram.com/sporticketsbr/"
                    className="text-sm md:text-md text-muted-foreground hover:text-foreground"
                  >
                    Instagram
                  </TranslatedLink>
                </li>
                <li>
                  <TranslatedLink
                    href="https://www.linkedin.com/company/sportickets"
                    className="text-sm md:text-md text-muted-foreground hover:text-foreground"
                  >
                    LinkedIn
                  </TranslatedLink>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="">
              <h3 className="md:mb-4 mb-2 text-md md:text-xl font-semibold">
                Legal
              </h3>
              <ul className="space-y-1">
                <li>
                  <TranslatedLink
                    href="/termos"
                    className="text-sm md:text-md text-muted-foreground hover:text-foreground"
                  >
                    Termos de uso
                  </TranslatedLink>
                </li>
                <li>
                  <TranslatedLink
                    href="/privacidade"
                    className="text-sm md:text-md text-muted-foreground hover:text-foreground"
                  >
                    Política de Privacidade
                  </TranslatedLink>
                </li>
                <li>
                  <TranslatedLink
                    href="/cookies"
                    className="text-sm md:text-md text-muted-foreground hover:text-foreground"
                  >
                    Política de Cookies
                  </TranslatedLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <div className="text-center text-sm text-muted-foreground py-6 bg-[#FAFAFA]">
        © {new Date().getFullYear()} SporTickets. Todos os direitos reservados
      </div>
    </footer>
  );
}
