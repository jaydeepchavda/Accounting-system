import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Budget {
  budgetPeriod: string;
  budgetYear: number;
  accounts: BudgetAccount[];
}

export interface BudgetAccount {
  accountId: number;
  budgetedAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createBudget(budget: Budget): Observable<any> {
    return this.http.post(`${this.apiUrl}/budgets`, budget);
  }

  getBudgets(budgetYear?: number, page = 1, limit = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (budgetYear) {
      params = params.set('budgetYear', budgetYear.toString());
    }

    return this.http.get(`${this.apiUrl}/budgets`, { params });
  }

  getBudget(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/budgets/${id}`);
  }

  getBudgetVariance(id: number, startDate?: string, endDate?: string): Observable<any> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.http.get(`${this.apiUrl}/budgets/${id}/variance`, { params });
  }
}
