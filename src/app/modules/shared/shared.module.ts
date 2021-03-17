import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { HeaderNavbarComponent } from "./header-navbar/header-navbar.component";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
// import {MatCardModule} from '@angular/material/card';
// import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, HeaderNavbarComponent],
  imports: [CommonModule, RouterModule, HttpClientModule],
  exports: [FooterComponent, HeaderComponent, HeaderNavbarComponent],
})
export class SharedModule {}
