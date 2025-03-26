import { AuthStep } from "@/hooks/useAuthSteps";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { Button } from "./ui/button";

interface StepLoginProps {
  nextStep: (next: AuthStep) => void;
}

const StepLogin = ({ nextStep }: StepLoginProps) => {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Seja bem-vindo!
        </h1>
        <p className="text-sm text-muted-foreground">
          Encontre, crie e participe de eventos esportivos com facilidade.
          Junte-se à comunidade!
        </p>
      </div>

      <div className="space-y-4">
        <Button
          className={cn(
            "w-full h-12 text-base font-normal justify-between px-4"
          )}
          onClick={() => nextStep(AuthStep.ENTER_EMAIL)}
        >
          Continuar com Email
          <Mail className="mr-2 h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col items-center space-y-4 mt-6">
        {/* <div className="flex w-full space-x-4">
          <Button
            variant="secondary"
            className={cn("w-full h-12 p-0")}
            onClick={() => { }}
          >
            <img src="/assets/icons/apple.svg" alt="Apple" className="w-6 h-6" />
          </Button>

          <Button
            variant="secondary"
            className={cn("w-full h-12 p-0")}
            onClick={() => { }}
          >
            <img src="/assets/icons/google.svg" alt="Google" className="w-6 h-6" />
          </Button>
        </div> */}

        <p className="text-xs text-muted-foreground text-center">
          Ao continuar você aceita nossos{" "}
          <a href="#" className="text-orange-500 underline">
            Termos de Serviço
          </a>
          ,{" "}
          <a href="#" className="text-orange-500 underline">
            Política de Privacidade
          </a>{" "}
          e confirma que leu.
        </p>
      </div>
    </div>
  );
};
export default StepLogin;
