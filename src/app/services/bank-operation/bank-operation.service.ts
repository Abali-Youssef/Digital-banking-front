import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountHistory, BankAccountOperation, PaginatedAccountOperationResponse } from '../models/bankAccountOperation';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankOperationService {

  constructor(private http: HttpClient) { }
  public getAccountHistory(id: string): Observable<AccountHistory> {
    return this.http.get<AccountHistory>(environment.API_BASE_URL + `bank-accounts/${id}/page-operations?page=1&size=1000`);
  }
  public getOperation(id: number
  ): Observable<BankAccountOperation> {
    return this.http.get<BankAccountOperation>(environment.API_BASE_URL + `account-operation/${id}`);
  }
}
