"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";

export function AddToHomeScreenModal() {
  const [promptEvent, setPromptEvent] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setPromptEvent(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = () => {
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.finally(() => {
        setPromptEvent(null);
        setShowPrompt(false);
      });
    }
  };

  if (!promptEvent || !showPrompt) return null;

  return (
    <div className="fixed bottom-0 right-4 left-4 z-50 mb-4 shadow-lg bg-white rounded-md ">
      <div className="flex justify-between items-center px-2 py-2">
        <p className="text-sm font-medium">
          Adicione o SporTickets à tela inicial
        </p>
        <Button size={"sm"} className="p-2" onClick={handleInstall}>
          Adicionar
        </Button>
        <div className="flex justify-start align-top">
          <Button
            variant={"ghost"}
            size={"sm"}
            className=""
            onClick={() => setShowPrompt(false)}
          >
            <CgClose />
          </Button>
        </div>
      </div>
    </div>
  );
}
