export interface Card {
    id: string;
    expirationDate: Date;
    type: string;
    accountId: string;

}

export interface PaginatedCardResponse {
    cards: Card[];
    currentPage: number;
    totalPage: number;
    totalElements: number;
    pageSize: number;
}