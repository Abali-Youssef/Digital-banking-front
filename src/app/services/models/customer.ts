export interface Customer {
    id: number;
    name: string;
    email: string;
    cin: string;
    password: string;
}

export interface PaginatedCustomerResponse {
    customers: Customer[];
    currentPage: number;
    totalPage: number;
    totalElements: number;
    pageSize: number;
}