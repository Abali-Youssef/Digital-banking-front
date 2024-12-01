import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card, PaginatedCardResponse } from '../models/card';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) { }
  public getCards(keyword: string, page: number): Observable<PaginatedCardResponse> {
    return this.http.get<PaginatedCardResponse>(environment.API_BASE_URL + "cards/" + ((keyword.trim().length > 0) ? keyword.trim() : "all") + "?page=" + page);
  }
  public saveCard(card: Card): Observable<Card> {
    return this.http.post<Card>(environment.API_BASE_URL + "cards", card);
  }
  public updateCard(card: Card): Observable<Card> {
    return this.http.put<Card>(environment.API_BASE_URL + "cards/update/" + card.id, card
    );
  }
  public deleteCard(id: Array<string>) {
    return this.http.delete(environment.API_BASE_URL + "cards/delete", {
      body: id,
    });
  }
}
