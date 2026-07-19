import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getWorkflows(status?: string, page = 1, limit = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get(`${this.apiUrl}/workflows`, { params });
  }

  approveJournal(journalId: number, notes?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/workflows/${journalId}/approve`, { notes });
  }

  rejectJournal(journalId: number, notes?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/workflows/${journalId}/reject`, { notes });
  }

  getWorkflowHistory(journalId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/workflows/${journalId}/history`);
  }
}
