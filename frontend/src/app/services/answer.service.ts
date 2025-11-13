import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Answer, CreateAnswerData, VoteData } from '../models/answer.model';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  private apiUrl = `${environment.apiUrl}/answers`;

  constructor(private http: HttpClient) {}

  /**
   * Get answers for a doubt
   */
  getAnswersByDoubt(doubtId: number): Observable<{ count: number; answers: Answer[] }> {
    return this.http.get<{ count: number; answers: Answer[] }>(`${this.apiUrl}/doubt/${doubtId}`);
  }

  /**
   * Get answers (alias for components)
   */
  getAnswers(doubtId: number): Observable<{ count: number; answers: Answer[] }> {
    return this.getAnswersByDoubt(doubtId);
  }

  /**
   * Create a new answer
   */
  createAnswer(data: CreateAnswerData | number, content?: string): Observable<{ message: string; answer: Answer }> {
    // Support both createAnswer(data) and createAnswer(doubtId, content)
    if (typeof data === 'number') {
      return this.http.post<{ message: string; answer: Answer }>(this.apiUrl, {
        doubtId: data,
        content: content
      });
    }
    return this.http.post<{ message: string; answer: Answer }>(this.apiUrl, data);
  }

  /**
   * Update answer
   */
  updateAnswer(id: number, answerText: string): Observable<{ message: string; answer: Answer }> {
    return this.http.put<{ message: string; answer: Answer }>(`${this.apiUrl}/${id}`, { answerText });
  }

  /**
   * Delete answer
   */
  deleteAnswer(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Accept an answer
   */
  acceptAnswer(id: number): Observable<{ message: string; answer: Answer }> {
    return this.http.post<{ message: string; answer: Answer }>(`${this.apiUrl}/${id}/accept`, {});
  }

  /**
   * Vote on an answer
   */
  voteAnswer(id: number, voteData: VoteData | string): Observable<{ message: string; answer: Answer }> {
    // Support both voteAnswer(id, voteData) and voteAnswer(id, 'upvote'/'downvote')
    if (typeof voteData === 'string') {
      return this.http.post<{ message: string; answer: Answer }>(`${this.apiUrl}/${id}/vote`, {
        voteType: voteData
      });
    }
    return this.http.post<{ message: string; answer: Answer }>(`${this.apiUrl}/${id}/vote`, voteData);
  }
}
