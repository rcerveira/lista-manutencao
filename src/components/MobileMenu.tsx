
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MobileMenu() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Início", path: "/" },
    { name: "Manutenções", path: "/manutencoes" },
    { name: "Solicitações", path: "/solicitacoes" },
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
          {menuItems.map((item) => (
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
        </nav>
      </SheetContent>
    </Sheet>
  );
}
