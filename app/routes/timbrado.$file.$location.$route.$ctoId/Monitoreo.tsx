import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Form, useFetcher, useParams } from "@remix-run/react";
import { useState, useEffect } from "react";
import { Cto, Department } from "~/interface/timbrado";
import { Button } from "~/components/ui/button";
import { Card, CardTitle, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { updateCtoData } from "~/service/data-excel";
import { useTimbrado } from "~/context/TimbradoContext";
import { findCto } from "./cto-util";

export default function Monitoring() {
  const { data, setData } = useTimbrado();
  const fetcher = useFetcher();
  const { file, location, route, ctoId } = useParams();

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    cto: ctoId || "",
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
    const updatedData = await updateCtoData(file, ctoId, formData);
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
    const cto = findCto(data, location, route, ctoId);
    if (cto) {
      setFormData({
        cto: ctoId || "",
        state: cto.state || "",
        observation: cto.observation || "",
        cto_campo: cto.cto_campo || "",
        divisor: cto.divisor || "",
        mcomentario: cto.mcomentario || "",
        mcomentario_2: cto.mcomentario_2 || "",
        timbrado: [],
      });
    }
  }, [ctoId, data, location, route]);

  return (
    <Card className="w-full mt-3">
      <CardTitle className="pl-6 py-3 text-xl">Monitoreo</CardTitle>
      <CardContent>
        <Form method="post" onSubmit={handleSubmit}>
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
              <SelectItem value="CTO MAL ESTADO">CTO MAL ESTADO</SelectItem>
              <SelectItem value="CTO ROBADO">CTO ROBADO</SelectItem>
              <SelectItem value="ARBOL/ARBUSTO IMPIDE ACCESO A CTO">
                ARBOL/ARBUSTO IMPIDE ACCESO A CTO
              </SelectItem>
              <SelectItem value="RIESGO ELECTRICO">RIESGO ELECTRICO</SelectItem>
              <SelectItem value="CALLE ANGOSTA">CALLE ANGOSTA</SelectItem>
              <SelectItem value="CARROS ESTACIONADOS">
                CARROS ESTACIONADOS
              </SelectItem>
              <SelectItem value="CTO VERTICAL">CTO VERTICAL</SelectItem>
              <SelectItem value="ESCALERA NO ALCANZA CTO">
                ESCALERA NO ALCANZA CTO
              </SelectItem>
              <SelectItem value="POSTE MAL ESTADO">POSTE MAL ESTADO</SelectItem>
              <SelectItem value="PROBLEMAS CON VECINOS O MUNICIPIO">
                PROBLEMAS CON VECINOS O MUNICIPIO
              </SelectItem>
              <SelectItem value="ZONA DE MERCADO">ZONA DE MERCADO</SelectItem>
              <SelectItem value="TECHO IMPIDE ACCESO">
                TECHO IMPIDE ACCESO
              </SelectItem>
              <SelectItem value="CTO EN FACHADA">CTO EN FACHADA</SelectItem>
              <SelectItem value="CALLE CON PENDIENTE">
                CALLE CON PENDIENTE
              </SelectItem>
              <SelectItem value="VIA CON TRANSITO">VIA CON TRANSITO</SelectItem>
              <SelectItem value="CALLE CON GRADAS">CALLE CON GRADAS</SelectItem>
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
              <SelectItem value="ZONA PELIGROSA">ZONA PELIGROSA</SelectItem>
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
              setFormData((prev) => ({ ...prev, cto_campo: e.target.value }))
            }
            placeholder="CTO Campo"
          />
          <Label htmlFor="divisor">Divisor</Label>
          <Input
            type="text"
            name="divisor"
            value={formData.divisor}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, divisor: e.target.value }))
            }
            placeholder="Divisor"
          />
          <div>
            <Label htmlFor="mcomentario">Comentario</Label>
            <Input
              type="text"
              name="mcomentario"
              value={formData.mcomentario}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  mcomentario: e.target.value,
                }))
              }
              placeholder="Comentario"
            />
          </div>
          <div>
            <Label htmlFor="mcomentario_2">Comentario 2</Label>
            <Input
              type="text"
              name="mcomentario_2"
              value={formData.mcomentario_2}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  mcomentario_2: e.target.value,
                }))
              }
              placeholder="Comentario"
            />
          </div>
          <Button className="mt-2" type="submit">
            {formData.cto ? "Actualizar" : "Crear"}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
