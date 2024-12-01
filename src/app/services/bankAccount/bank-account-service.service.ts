import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BankAccount, PaginatedAccountResponse } from '../models/bankAccount';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { BankAccountOperation } from '../models/bankAccountOperation';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  constructor(private http: HttpClient) { }
  public getAccountByCustomerId(cin: string): Observable<Array<BankAccount>> {
    return this.http.get<Array<BankAccount>>(environment.API_BASE_URL + "bank-accounts/customer/" + cin);
  }
  public getAccount(id: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(environment.API_BASE_URL + "bank-accounts/" + id);
  }
  public getAccounts(cin: string, page: number): Observable<PaginatedAccountResponse> {
    return this.http.get<PaginatedAccountResponse>(environment.API_BASE_URL + "bank-accounts?cin=" + cin + "&page=" + page);
  }
  public saveAccount(bankAccount: BankAccount): Observable<BankAccount> {
    if (bankAccount.type == "SAVING_ACCOUNT") {
      return this.http.post<BankAccount>(environment.API_BASE_URL + "bank-accounts/saving", bankAccount);

    }
    return this.http.post<BankAccount>(environment.API_BASE_URL + "bank-accounts/current", bankAccount);
  }

  public performOperation(accountId: string, accountIdDest: string, operation: BankAccountOperation) {
    if (operation.operationType == "DEBIT") {
      return this.http.put(environment.API_BASE_URL + "debit/" + accountId, operation);

    } else if (operation.operationType == "CREDIT") {
      return this.http.put(environment.API_BASE_URL + "credit/" + accountId, operation);
    }
    return this.http.put(environment.API_BASE_URL + "transfer", { sourceAccountId: accountId, destinationAccountId: accountIdDest, operation: operation });

  }
  public updateAccount(accountId: string, st: string) {

    return this.http.put(environment.API_BASE_URL + `bank-accounts/${accountId}`, st);

  }

  public DeleteBankAccount(listId: Array<string>) {
    return this.http.delete(environment.API_BASE_URL + "bank-accounts", {
      body: listId,
    });
  }

}
