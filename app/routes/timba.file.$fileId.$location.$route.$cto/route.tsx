import { Form, useFetcher, useParams } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useTimbrado } from "~/context/TimbaContetext";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { updateCtoData } from "~/service/data-excel";
import { findCto } from "./cto-util";

const CtoContent = () => {
  const { data, setData } = useTimbrado();
  const fetcher = useFetcher();
  const { fileId, location, route, cto } = useParams();

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    cto: cto || "",
    state: "",
    observation: "",
    cto_campo: "",
    divisor: "",
    mcomentario: "",
    mcomentario_2: "",
    timbrado: [],
  });

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetcher.load("/"); // Asegúrate de que esto es necesario y correcto
    const updatedData = await updateCtoData(fileId || "", cto || "", formData);
    setData(updatedData);
    resetForm();
  };

  // Resetea el formulario
  const resetForm = () => {
    setFormData({
      cto: "",
      state: "",
      observation: "",
      cto_campo: "",
      divisor: "",
      mcomentario: "",
      mcomentario_2: "",
      timbrado: [],
    });
  };

  // Efecto para cargar datos del CTO cuando cambia ctoId
  useEffect(() => {
    const ctoFind = findCto(data, location, route, cto);
    if (ctoFind) {
      setFormData({
        cto: cto || "",
        state: ctoFind.state || "",
        observation: ctoFind.observation || "",
        cto_campo: ctoFind.cto_campo || "",
        divisor: ctoFind.divisor || "",
        mcomentario: ctoFind.mcomentario || "",
        mcomentario_2: ctoFind.mcomentario_2 || "",
        timbrado: [],
      });
    }
  }, [cto, data, location, route]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <Form method="post" onSubmit={handleSubmit}>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">CTO Info</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <div className="space-y-4">
                <Label htmlFor="cto">CTO</Label>
                <Input type="text" name="cto" value={formData.cto} disabled />
                <Label htmlFor="estado_cto">Estado CTO</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, state: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el estado inicial" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EN PROCESO">EN PROCESO</SelectItem>
                    <SelectItem value="SIN ACCESO">SIN ACCESO</SelectItem>
                    <SelectItem value="TIMBRADO">TIMBRADO</SelectItem>
                  </SelectContent>
                </Select>
                <Label htmlFor="observacion">Observación</Label>
                <Select
                  value={formData.observation}
                  onValueChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, observation: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el estado inicial" />
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
                    <SelectItem value="CALLE ANGOSTA">CALLE ANGOSTA</SelectItem>
                    <SelectItem value="CARROS ESTACIONADOS">
                      CARROS ESTACIONADOS
                    </SelectItem>
                    <SelectItem value="CTO VERTICAL">CTO VERTICAL</SelectItem>
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
                    <SelectItem value="ZONA EN OBRA">ZONA EN OBRA</SelectItem>
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
                <Label htmlFor="cto_campo">CTO Campo</Label>
                <Input
                  type="text"
                  name="cto_campo"
                  value={formData.cto_campo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cto_campo: e.target.value,
                    }))
                  }
                  placeholder="CTO Campo"
                />
                <Label htmlFor="divisor">Divisor</Label>
                <Input
                  type="text"
                  name="divisor"
                  value={formData.divisor}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      divisor: e.target.value,
                    }))
                  }
                  placeholder="Divisor"
                />
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
        </Form>
      </CardContent>
    </Card>
  );
};

export default CtoContent;
