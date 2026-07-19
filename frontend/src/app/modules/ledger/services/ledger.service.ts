import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LedgerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLedger(accountId: number, startDate?: string, endDate?: string): Observable<any> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.http.get(`${this.apiUrl}/ledger/${accountId}`, { params });
  }

  getTrialBalance(asOfDate?: string): Observable<any> {
    let params = new HttpParams();
    if (asOfDate) {
      params = params.set('asOfDate', asOfDate);
    }
    return this.http.get(`${this.apiUrl}/ledger/trial-balance`, { params });
  }

  getAccountSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ledger/summary`);
  }
}
