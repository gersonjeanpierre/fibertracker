export interface Department {
  department: string;
  routes: Array<Route>;
}

export interface Route {
  route: string;
  gestor: string;
  tecnico: string;
  ctos: Array<Cto>;
}

export interface Cto {
  cto: string;
  state: string;
  observation: string;
  cto_campo: string;
  divisor: string;
  mcomentario: string;
  mcomentario_2: string;
  timbrado?: Array<TimbradoData>;
}

export interface TimbradoData {
  cto: string;
  borne: string;
  lineIdInicial: string;
  vnoCodeInicial: string;
  olt: string;
  slot: number;
  port: number;
  onuInicial: number;
  estadoInicial: string;
  onuFinal: number;
  estadoEnCampoInicial: string;
  estadoEnCampoFinal: string;
  potenciaAntes: number;
  potenciaDespues: number;
  potenciaCampo: number;
  lineIdFinal: string;
  vnoCodeFinal: string;
  comentario: string;
  observacion: string;
  ctoEnCampo: string;
  zona: string;
  grupo: string;
  fecha: Date;
  horaInicio: Date;
  horaCierre: Date;
  gestor: string;
}
