import { Card } from "./card";
import { Customer } from "./customer";

export interface BankAccount {
    id: string;
    balance: number;
    createdAt?: Date;
    type: string;
    status: string;
    cards?: Card[];
    customer?: any;
    overDraft: number;
    interestRate: number;

}

export interface PaginatedAccountResponse {
    bankAccounts: BankAccount[];
    currentPage: number;
    totalPage: number;
    totalElements: number;
    pageSize: number;
}