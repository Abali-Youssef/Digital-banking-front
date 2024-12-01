import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../models/auth';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private authorities: string[] = [];


  constructor(private http: HttpClient) {
    const storedAuthorities = localStorage.getItem('scope');
    // storedAuthorities ? console.log(JSON.parse(storedAuthorities).split(" ")) : [];
    this.authorities = storedAuthorities ? storedAuthorities.split(" ") : [];
    console.log(this.authorities)
  }

  hasAuthority(authority: string): boolean {
    return this.authorities.includes(authority);
  }
  public login(credentials: any): Observable<Auth> {
    return this.http.post<Auth>(environment.API_BASE_URL + "login", { ...credentials, grantType: "password", withRefreshToken: true });
  }
}
