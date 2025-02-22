
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MobileMenu() {
  const navigate = useNavigate();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const mainMenuItems = [
    { name: "Início", path: "/" },
    { name: "Manutenções", path: "/manutencoes" },
    { name: "Solicitações", path: "/solicitacoes" },
  ];

  const submenuItems = [
    { name: "Categorias", path: "/categorias" },
    { name: "Status", path: "/status" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[280px]">
        <nav className="flex flex-col gap-4 mt-8">
          {mainMenuItems.map((item) => (
            <SheetClose key={item.path} asChild>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </Button>
            </SheetClose>
          ))}
          <div className="border-l-2 border-muted ml-2 pl-2">
            <Button
              variant="ghost"
              className="justify-between w-full"
              onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
            >
              Configurações
              {isSubmenuOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {isSubmenuOpen && (
              <div className="ml-4 space-y-1">
                {submenuItems.map((item) => (
                  <SheetClose key={item.path} asChild>
                    <Button
                      variant="ghost"
                      className="justify-start w-full text-sm"
                      onClick={() => navigate(item.path)}
                    >
                      {item.name}
                    </Button>
                  </SheetClose>
                ))}
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
