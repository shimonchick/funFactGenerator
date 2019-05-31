import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Product} from '../models/product';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
};
const textResponseType = {
  responseType: 'text' as 'json' // workaround
};

@Injectable({
  providedIn: 'root'
})
export class ProductService implements OnInit{
  private readonly productUrl = 'http://localhost:3000/products';  // URL to web api

  constructor(private http: HttpClient) {
  }

  async getProducts(page: number, limit: number) {
    const params = new HttpParams()
      .append('page', page.toString())
      .append('limit', limit.toString());
    console.log('request made');
    return await this.http.get<Product[]>(this.productUrl, {params}).toPromise();
  }

  async getProduct(id: string) {
    const getUrl = `${this.productUrl}/${id}`;
    return this.http.get<Product>(getUrl).toPromise();
  }

  async setProduct(product: Product) {
    console.log(product);
    const requestType = product.id !== undefined ? 'put' : 'post';
    return await this.http[requestType]<Product>(this.productUrl, product, {...httpOptions, ...textResponseType}).toPromise();
  }

  async deleteProduct(product: Product) {
    const deleteUrl = `${this.productUrl}/${product.id}`;
    return await this.http.delete<Product>(deleteUrl, {...httpOptions, ...textResponseType}).toPromise();
  }

  ngOnInit(): void {
    const headerValue = 'Bearer ' + localStorage.getItem('token');
    console.log(headerValue);
    httpOptions.headers.append('Authorization', headerValue);

  }
}
