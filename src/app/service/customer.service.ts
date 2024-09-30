import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  public getCustomers(): Observable<Array<Customer>> {

    return this.http.get<Array<Customer>>(environment.API_BASE_URL + "customers");
  }
  public searchCustomers(keyword: string): Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>(environment.API_BASE_URL + "customers/search?keyword=" + keyword);
  }
  public saveCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(environment.API_BASE_URL + "customers", customer);
  }
  public deleteCustomer(id: number) {
    return this.http.delete(environment.API_BASE_URL + "customers/delete/" + id);
  }
}
