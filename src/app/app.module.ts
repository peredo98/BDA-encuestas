import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { UsuarioModule } from "./modules/usuario/usuario.module";
import { AdministradorModule } from "./modules/administrador/administrador.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { registerLocaleData } from "@angular/common";
import localeMX from "@angular/common/locales/es-MX";
import localeUS from "@angular/common/locales/en";
import { SharedModule } from "./modules/shared/shared.module";

registerLocaleData(localeMX, "es-MX");
registerLocaleData(localeUS, "en");

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent],
  imports: [
    SharedModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AdministradorModule,
    UsuarioModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
