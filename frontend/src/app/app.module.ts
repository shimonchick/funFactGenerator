import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatToolbarModule, MatGridListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';
import { ProductsComponent } from './products/products.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: ':id', component: ProductDetailsComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, { dataEncapsulation: false }
    // ),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
