import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router"; // CLI imports router
import { EstadisticasUsuarioComponent } from "./estadisticas-usuario/estadisticas-usuario.component";
import { ListaEncuestasUsuarioComponent } from "./lista-encuestas-usuario/lista-encuestas-usuario.component";
import { ContestarEncuestaComponent } from "./contestar-encuesta/contestar-encuesta.component";

const routes: Routes = [
  {
    path: "estadisticas/:id",
    component: EstadisticasUsuarioComponent,
    data: { animation: "isEstadisticas" },
  },
  {
    path: "",
    component: ListaEncuestasUsuarioComponent,
    data: { animation: "isListaEncuentas" },
  },
  {
    path: "contestarEncuesta/:id",
    component: ContestarEncuestaComponent,
    data: { animation: "isContestarEncuestas" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioRoutingModule {}
