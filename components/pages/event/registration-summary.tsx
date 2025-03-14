"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function RegistrationSummary() {
  const [masculinoCount, setMasculinoCount] = useState(1);
  const [femininoCount, setFemininoCount] = useState(0);

  const price = 50.0;
  const total = (masculinoCount + femininoCount) * price;

  return (
    <Card className="overflow-hidden">
      <div className="bg-green-100 p-2 text-center text-xs text-green-800">
        00:04:34
      </div>

      <div className="p-4">
        <div className="mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">MASCULINO DUPLA</h3>
              <p className="text-xs text-gray-500">Resta 1 vaga disponível</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">R$ 50,00</span>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 rounded-r-none"
                  onClick={() =>
                    setMasculinoCount(Math.max(0, masculinoCount - 1))
                  }
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <div className="flex h-6 w-6 items-center justify-center border-y bg-white text-xs">
                  {masculinoCount}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 rounded-l-none"
                  onClick={() =>
                    setMasculinoCount(Math.min(1, masculinoCount + 1))
                  }
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">FEMININO DUPLA</h3>
              <p className="text-xs text-gray-500">Resta 1 vaga disponível</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">R$ 50,00</span>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 rounded-r-none"
                  onClick={() =>
                    setFemininoCount(Math.max(0, femininoCount - 1))
                  }
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <div className="flex h-6 w-6 items-center justify-center border-y bg-white text-xs">
                  {femininoCount}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 rounded-l-none"
                  onClick={() =>
                    setFemininoCount(Math.min(1, femininoCount + 1))
                  }
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between border-t pt-3">
          <span className="font-medium">Total</span>
          <span className="text-lg font-bold">R$ {total.toFixed(2)}</span>
        </div>

        <Button className="w-full bg-orange-500 hover:bg-orange-600">
          Realizar Inscrição →
        </Button>
      </div>
    </Card>
  );
}
