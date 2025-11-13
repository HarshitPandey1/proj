import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Doubt, 
  CreateDoubtData, 
  UpdateDoubtData, 
  DoubtFilters 
} from '../models/doubt.model';

@Injectable({
  providedIn: 'root'
})
export class DoubtService {
  private apiUrl = `${environment.apiUrl}/doubts`;

  constructor(private http: HttpClient) {}

  /**
   * Get all doubts with filters
   */
  getDoubts(filters?: DoubtFilters): Observable<{ count: number; doubts: Doubt[] }> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<{ count: number; doubts: Doubt[] }>(this.apiUrl, { params });
  }

  /**
   * Get doubt by ID
   */
  getDoubtById(id: number): Observable<{ doubt: Doubt }> {
    return this.http.get<{ doubt: Doubt }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new doubt
   */
  createDoubt(data: CreateDoubtData | FormData): Observable<{ message: string; doubt: Doubt }> {
    // If already FormData, use it directly
    if (data instanceof FormData) {
      return this.http.post<{ message: string; doubt: Doubt }>(this.apiUrl, data);
    }
    
    // Otherwise, convert to FormData
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    
    if (data.subjectId) {
      formData.append('subjectId', data.subjectId.toString());
    }
    
    if (data.tags && data.tags.length > 0) {
      formData.append('tags', data.tags.join(','));
    }
    
    if (data.image) {
      formData.append('image', data.image);
    }

    return this.http.post<{ message: string; doubt: Doubt }>(this.apiUrl, formData);
  }

  /**
   * Update doubt
   */
  updateDoubt(id: number, data: UpdateDoubtData | FormData): Observable<{ message: string; doubt: Doubt }> {
    // If FormData, use it directly for multipart/form-data
    if (data instanceof FormData) {
      return this.http.put<{ message: string; doubt: Doubt }>(`${this.apiUrl}/${id}`, data);
    }
    
    // Otherwise, send as JSON
    return this.http.put<{ message: string; doubt: Doubt }>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Delete doubt
   */
  deleteDoubt(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search doubts
   */
  searchDoubts(query: string, limit?: number): Observable<{ count: number; doubts: Doubt[] }> {
    let params = new HttpParams();
    if (limit) {
      params = params.set('limit', limit.toString());
    }

    return this.http.get<{ count: number; doubts: Doubt[] }>(`${this.apiUrl}/search/${query}`, { params });
  }

  /**
   * Get user's own doubts
   */
  getMyDoubts(): Observable<{ count: number; doubts: Doubt[] }> {
    return this.http.get<{ count: number; doubts: Doubt[] }>(`${this.apiUrl}/my-doubts`);
  }
}
