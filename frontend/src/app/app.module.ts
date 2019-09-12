import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list.component';
import { LoginComponent } from './login.component';

import { StoreModule } from '@ngrx/store';
import { tokenReducer } from './store/token.reducer';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({ token: tokenReducer })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
