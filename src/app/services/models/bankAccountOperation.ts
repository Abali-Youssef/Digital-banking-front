import { Card } from "./card";
import { Customer } from "./customer";

export interface BankAccountOperation {
    id: string;
    amount: number;
    operationDate: Date;
    description: string;
    operationType: string;
}

export interface PaginatedAccountOperationResponse {
    operations: BankAccountOperation[];
    currentPage: number;
    totalPage: number;
    totalElements: number;
    pageSize: number;
}
export interface AccountHistory {
    accountId: string;
    balance: number;
    AccountType: string;
    bankAccountOperations: BankAccountOperation[];
    currentPage: number;
    totalPage: number;
    totalElements: number;
    pageSize: number;
}
