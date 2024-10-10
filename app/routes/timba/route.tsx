"use client";

import { useState, useRef, useEffect } from "react";
import {
  FileIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  BoxIcon,
  MenuIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

// Mock data and functions (replace with actual data and functions)
const mockData = {
  departments: ["Department A", "Department B", "Department C"],
  routes: ["Route 1", "Route 2", "Route 3"],
  ctos: ["CTO 1", "CTO 2", "CTO 3"],
};

const transformData = (data: ArrayBuffer) => {
  // Mock implementation
  console.log("Transforming data:", data);
  return [];
};

const saveDataByKey = async (key: string, data: any) => {
  // Mock implementation
  console.log("Saving data:", key, data);
};

const getAllKeys = async () => {
  // Mock implementation
  return ["File 1", "File 2", "File 3"];
};

export default function Component() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [selectedCTO, setSelectedCTO] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("Dashboard");
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const name = file.name.split(".")[0];
    const rawFileData = await file.arrayBuffer();

    try {
      const dataFile = transformData(rawFileData);
      await saveDataByKey(name, dataFile);
      setSelectedFile(name);
      // Update other state as needed
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboardIcon },
    { name: "Files", icon: FileIcon },
    { name: "Departments", icon: MapPinIcon },
    { name: "CTOs", icon: BoxIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Timbrado Dashboard</h1>
          <nav>
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant={activeNavItem === item.name ? "default" : "ghost"}
                className={`w-full justify-start mb-2 ${
                  activeNavItem === item.name
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
                onClick={() => setActiveNavItem(item.name)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <Button
          variant="outline"
          size="icon"
          className="md:hidden mb-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <MenuIcon className="h-4 w-4" />
        </Button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">File Upload</h2>
          <Card>
            <CardContent className="p-6">
              <Input
                type="file"
                onChange={handleFileUpload}
                accept=".xlsx"
                className="mb-4"
              />
              <div className="flex flex-wrap gap-2">
                {["File 1", "File 2", "File 3"].map((key) => (
                  <Button
                    key={key}
                    onClick={() => setSelectedFile(key)}
                    variant={selectedFile === key ? "default" : "outline"}
                  >
                    {key}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Department Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {mockData.departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Route Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedRoute}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Route" />
                </SelectTrigger>
                <SelectContent>
                  {mockData.routes.map((route) => (
                    <SelectItem key={route} value={route}>
                      {route}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>CTO Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mockData.ctos.map((cto) => (
                <Button
                  key={cto}
                  onClick={() => setSelectedCTO(cto)}
                  variant={selectedCTO === cto ? "default" : "outline"}
                >
                  {cto}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">CTO Info</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>
              <TabsContent value="info">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cto">CTO</Label>
                    <Input id="cto" value={selectedCTO || ""} disabled />
                  </div>
                  <div>
                    <Label htmlFor="estado_cto">Estado CTO</Label>
                    <Select>
                      <SelectTrigger id="estado_cto">
                        <SelectValue placeholder="Seleccione el estado inicial" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EN PROCESO">EN PROCESO</SelectItem>
                        <SelectItem value="SIN ACCESO">SIN ACCESO</SelectItem>
                        <SelectItem value="TIMBRADO">TIMBRADO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="observacion">Observación</Label>
                    <Select>
                      <SelectTrigger id="observacion">
                        <SelectValue placeholder="Seleccione una observación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CTO MAL ESTADO">
                          CTO MAL ESTADO
                        </SelectItem>
                        <SelectItem value="CTO ROBADO">CTO ROBADO</SelectItem>
                        <SelectItem value="ARBOL/ARBUSTO IMPIDE ACCESO A CTO">
                          ARBOL/ARBUSTO IMPIDE ACCESO A CTO
                        </SelectItem>
                        <SelectItem value="RIESGO ELECTRICO">
                          RIESGO ELECTRICO
                        </SelectItem>
                        <SelectItem value="CALLE ANGOSTA">
                          CALLE ANGOSTA
                        </SelectItem>
                        <SelectItem value="CARROS ESTACIONADOS">
                          CARROS ESTACIONADOS
                        </SelectItem>
                        <SelectItem value="CTO VERTICAL">
                          CTO VERTICAL
                        </SelectItem>
                        <SelectItem value="ESCALERA NO ALCANZA CTO">
                          ESCALERA NO ALCANZA CTO
                        </SelectItem>
                        <SelectItem value="POSTE MAL ESTADO">
                          POSTE MAL ESTADO
                        </SelectItem>
                        <SelectItem value="PROBLEMAS CON VECINOS O MUNICIPIO">
                          PROBLEMAS CON VECINOS O MUNICIPIO
                        </SelectItem>
                        <SelectItem value="ZONA DE MERCADO">
                          ZONA DE MERCADO
                        </SelectItem>
                        <SelectItem value="TECHO IMPIDE ACCESO">
                          TECHO IMPIDE ACCESO
                        </SelectItem>
                        <SelectItem value="CTO EN FACHADA">
                          CTO EN FACHADA
                        </SelectItem>
                        <SelectItem value="CALLE CON PENDIENTE">
                          CALLE CON PENDIENTE
                        </SelectItem>
                        <SelectItem value="VIA CON TRANSITO">
                          VIA CON TRANSITO
                        </SelectItem>
                        <SelectItem value="CALLE CON GRADAS">
                          CALLE CON GRADAS
                        </SelectItem>
                        <SelectItem value="DESMONTE IMPIDE ACCESO">
                          DESMONTE IMPIDE ACCESO
                        </SelectItem>
                        <SelectItem value="POSTE IMPIDE ACCESO">
                          POSTE IMPIDE ACCESO
                        </SelectItem>
                        <SelectItem value="ZONA EN OBRA">
                          ZONA EN OBRA
                        </SelectItem>
                        <SelectItem value="REJA IMPIDE ACCESO">
                          REJA IMPIDE ACCESO
                        </SelectItem>
                        <SelectItem value="LETRERO IMPIDE ACCESO A CTO">
                          LETRERO IMPIDE ACCESO A CTO
                        </SelectItem>
                        <SelectItem value="PUERTO NO DETECTADO">
                          PUERTO NO DETECTADO
                        </SelectItem>
                        <SelectItem value="COCHERA IMPIDE ACCESO">
                          COCHERA IMPIDE ACCESO
                        </SelectItem>
                        <SelectItem value="ZONA PELIGROSA">
                          ZONA PELIGROSA
                        </SelectItem>
                        <SelectItem value="CALLE CON DESNIVEL">
                          CALLE CON DESNIVEL
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cto_campo">CTO Campo</Label>
                    <Input id="cto_campo" placeholder="CTO Campo" />
                  </div>
                  <div>
                    <Label htmlFor="divisor">Divisor</Label>
                    <Input id="divisor" placeholder="Divisor" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="comments">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mcomentario">Comentario</Label>
                    <Input id="mcomentario" placeholder="Comentario" />
                  </div>
                  <div>
                    <Label htmlFor="mcomentario_2">Comentario 2</Label>
                    <Input id="mcomentario_2" placeholder="Comentario 2" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <Button className="mt-4">Guardar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
