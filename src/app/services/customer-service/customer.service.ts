import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer, PaginatedCustomerResponse } from '../models/customer';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  public getCustomers(): Observable<Array<Customer>> {

    return this.http.get<Array<Customer>>(environment.API_BASE_URL + "customers");
  }
  public searchCustomers(keyword: string, page: number): Observable<PaginatedCustomerResponse> {
    return this.http.get<PaginatedCustomerResponse>(environment.API_BASE_URL + "customers?keyword=" + keyword + "&page=" + page);
  }
  public getcustomersByCin(cin: string): Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>(environment.API_BASE_URL + "customers/" + cin);
  }
  public saveCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(environment.API_BASE_URL + "customers/register", customer);
  }
  public updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(environment.API_BASE_URL + "customers/update/" + customer.id, customer
    );
  }
  public deleteCustomer(id: Array<number>) {
    return this.http.delete(environment.API_BASE_URL + "customers/delete", {
      body: id,
    });
  }
}
