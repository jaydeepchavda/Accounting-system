import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface JournalEntry {
  id?: number;
  journalDate: string;
  description: string;
  entries: JournalLineItem[];
  status?: string;
  createdAt?: string;
}

export interface JournalLineItem {
  accountId: number;
  debit?: number;
  credit?: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createJournal(journal: JournalEntry): Observable<any> {
    return this.http.post(`${this.apiUrl}/journals`, journal);
  }

  getJournals(status?: string, page = 1, limit = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get(`${this.apiUrl}/journals`, { params });
  }

  getJournal(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/journals/${id}`);
  }

  updateJournal(id: number, journal: Partial<JournalEntry>): Observable<any> {
    return this.http.put(`${this.apiUrl}/journals/${id}`, journal);
  }

  deleteJournal(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/journals/${id}`);
  }

  submitForApproval(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/workflows/${id}/submit`, {});
  }
}
