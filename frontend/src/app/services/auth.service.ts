import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
};


@Injectable({
  providedIn: 'root'
})

export class AuthService {


  private baseUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {
  }

  register(name: string, password: string) {
    // this.http.post()
    this.http.post(this.baseUrl + 'register', {name, password}, httpOptions).toPromise()
      .then(() => {
        alert('successfully registered');
      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });

  }

  login(name: string, password: string) {
    console.log(name);
    console.log(password);
    this.http.post(this.baseUrl + 'login', {name, password}, httpOptions).toPromise()
      .then((response: any) => {
        alert(JSON.stringify(response));
        localStorage.setItem('token', response.token);
      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });

  }
}
