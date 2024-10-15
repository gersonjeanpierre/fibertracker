import { Label } from "@radix-ui/react-label";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [gestor, setGestor] = useState("");

  useEffect(() => {
    const savedGestor = localStorage.getItem("gestor");
    if (savedGestor) {
      setGestor(savedGestor);
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGestor(event.target.value);
  };

  const handleButtonClick = () => {
    localStorage.setItem("gestor", gestor.toUpperCase());
  };
  return (
    <div className="flex flex-col gap-5 h-screen items-center justify-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        FiberTracker
      </h1>
      <div>
        <Label htmlFor="gestor">Gestor</Label>
        <Input
          id="gestor"
          placeholder="Ingrese su nombre"
          value={gestor}
          onChange={handleInputChange}
        />
      </div>
      <Link to="/tipo">
        <Button onClick={handleButtonClick}>Ingresar</Button>
      </Link>
    </div>
  );
}
