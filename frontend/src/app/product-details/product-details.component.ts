import {ProductService} from '../services/product.service';
import {Observable} from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../models/product';
import {routerNgProbeToken} from '@angular/router/src/router_module';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product = new Product();

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private router: Router) {
    console.log(this.product);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProduct(id).then((product: any) => {
        this.product = product;
        console.log(product);
      });
    }
  }

  async onSubmit() {
    await this.productService.setProduct(this.product);
    await this.router.navigateByUrl('/');
  }

  async delete(product: Product) {
    await this.productService.deleteProduct(product);
    await this.router.navigateByUrl('/');
  }

}
