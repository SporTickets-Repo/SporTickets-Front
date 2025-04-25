"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search as SearchIcon, X as XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export function HomeSearchBar() {
  const [search, setSearch] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("searchHistory");
    if (stored) {
      setSearchHistory(JSON.parse(stored));
    }
  }, []);

  const saveSearch = (value: string) => {
    if (!value.trim() || searchHistory.includes(value)) return;
    const updatedHistory = [...searchHistory, value];
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const removeFromHistory = (value: string) => {
    const updatedHistory = searchHistory.filter((item) => item !== value);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const handleSelectHistoryItem = (value: string) => {
    setSearch(value);
    saveSearch(value);
    router.push(`/evento/buscar?name=${value}`);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveSearch(search);
      router.push(`/evento/buscar?name=${search}`);
      setIsOpen(false);
    }
  };

  return (
    <Command className="rounded-lg border shadow-md md:min-w-[450px]">
      <CommandInput
        placeholder="Digite sua busca..."
        className="w-full md:pr-10 py-6 px-4 rounded-2xl md:text-lg text-md"
        value={search}
        onValueChange={setSearch}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
      />

      <CommandList>
        {isOpen && (
          <>
            <CommandEmpty>Nenhum histórico encontrado.</CommandEmpty>

            {searchHistory.length > 0 && (
              <CommandGroup heading="Histórico recente">
                {searchHistory
                  .slice(-5)
                  .reverse()
                  .map((item) => (
                    <CommandItem
                      key={item}
                      onSelect={() => handleSelectHistoryItem(item)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <SearchIcon className="h-4 w-4" />
                        <span>{item}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(item);
                        }}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </Command>
  );
}
