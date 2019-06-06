import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Product} from '../models/product';


const textResponseType = {
  responseType: 'text' as 'json' // workaround
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productUrl = 'http://localhost:3000/products';  // URL to web api
  private httpOptions;
  constructor(private http: HttpClient) {
    const headerValue = 'Bearer ' + localStorage.getItem('token');
    console.log(headerValue);
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': headerValue
      }),
    };
  }

  async getProducts(page: number, limit: number) {
    const params = new HttpParams()
      .append('page', page.toString())
      .append('limit', limit.toString());
    console.log('request made');
    return await this.http.get<Product[]>(this.productUrl, {params, ...this.httpOptions}).toPromise();
  }

  async getProduct(id: string) {
    const getUrl = `${this.productUrl}/${id}`;
    console.log({...this.httpOptions, ...textResponseType});
    return await this.http.get<Product>(getUrl, {...this.httpOptions}).toPromise();
  }

  async setProduct(product: Product) {
    console.log(product);
    const requestType = product.id !== undefined ? 'put' : 'post';
    return await this.http[requestType]<Product>(this.productUrl, product, {...this.httpOptions, ...textResponseType}).toPromise();
  }

  async deleteProduct(product: Product) {
    const deleteUrl = `${this.productUrl}/${product.id}`;
    return await this.http.delete(deleteUrl, {...this.httpOptions, ...textResponseType}).toPromise();
  }

  async like(id: string) {
    const likeUrl = `${this.productUrl}/${id}/like`;
    return await this.http.post(likeUrl, {}, {...this.httpOptions, ...textResponseType}).toPromise();
  }
}
