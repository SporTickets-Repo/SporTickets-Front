import { getDictionary } from "@/get-dictionary";
import { AuthStep } from "@/hooks/useAuthSteps";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { Button } from "./ui/button";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

interface StepLoginProps {
  nextStep: (next: AuthStep) => void;
  dictionary: Dictionary;
}

const StepLogin = ({ nextStep, dictionary }: StepLoginProps) => {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {dictionary.auth.welcomeTitle}
        </h1>
        <p className="text-sm text-muted-foreground">
          {dictionary.auth.welcomeSubtitle}
        </p>
      </div>

      <div className="space-y-4">
        <Button
          className={cn(
            "w-full h-12 text-base font-normal justify-between px-4"
          )}
          onClick={() => nextStep(AuthStep.ENTER_EMAIL)}
        >
          {dictionary.auth.continueWithEmail}
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
          {dictionary.auth.termsStart}{" "}
          <a href="#" className="text-orange-500 underline">
            {dictionary.auth.termsOfService}
          </a>
          ,{" "}
          <a href="#" className="text-orange-500 underline">
            {dictionary.auth.privacyPolicy}
          </a>{" "}
          {dictionary.auth.termsEnd}
        </p>
      </div>
    </div>
  );
};

export default StepLogin;
