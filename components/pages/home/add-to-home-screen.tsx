"use client";

import { useEffect, useState } from "react";

export function AddToHomeScreenModal() {
  const [promptEvent, setPromptEvent] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Verifica se é um dispositivo móvel
    const checkMobile = () => {
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      return isTouchDevice && isSmallScreen;
    };

    if (!checkMobile()) return;

    setIsMobile(true);

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

  if (!showPrompt || !isMobile) return null;

  return (
    <div className="fixed bottom-4 right-0 z-50 bg-white shadow-lg p-4 rounded-md border border-gray-200 flex justify-between items-center">
      <p className="text-sm font-medium">
        Adicione o SporTickets à tela inicial
      </p>
      <button
        className="text-sm bg-sporticket-purple text-white px-3 py-1 rounded ml-4"
        onClick={handleInstall}
      >
        Adicionar
      </button>
    </div>
  );
}
