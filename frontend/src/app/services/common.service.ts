import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Subject, Notification } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get all subjects
   */
  getSubjects(): Observable<{ count: number; subjects: Subject[] }> {
    return this.http.get<{ count: number; subjects: Subject[] }>(`${this.apiUrl}/subjects`);
  }

  /**
   * Get notifications
   */
  getNotifications(limit?: number, offset?: number): Observable<any> {
    const params: any = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;

    return this.http.get(`${this.apiUrl}/notifications`, { params });
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(): Observable<{ unreadCount: number }> {
    return this.http.get<{ unreadCount: number }>(`${this.apiUrl}/notifications/unread-count`);
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/${id}/read`, {});
  }

  /**
   * Mark notification as read (alias for components)
   */
  markNotificationAsRead(id: number): Observable<any> {
    return this.markAsRead(id);
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/read-all`, {});
  }

  /**
   * Mark all notifications as read (alias for components)
   */
  markAllNotificationsAsRead(): Observable<any> {
    return this.markAllAsRead();
  }
}
