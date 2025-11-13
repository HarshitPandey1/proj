import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  unreadCount = 0;
  loading = true;

  constructor(
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.commonService.getNotifications().subscribe({
      next: (response) => {
        this.notifications = response.notifications;
        this.unreadCount = this.notifications.filter(n => !n.is_read).length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.loading = false;
      }
    });
  }

  markAsRead(notificationId: number): void {
    this.commonService.markNotificationAsRead(notificationId).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.is_read = true;
          this.unreadCount--;
        }
      },
      error: (error) => {
        console.error('Error marking as read:', error);
      }
    });
  }

  markAllAsRead(): void {
    this.commonService.markAllNotificationsAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.is_read = true);
        this.unreadCount = 0;
      },
      error: (error) => {
        console.error('Error marking all as read:', error);
      }
    });
  }

  handleNotificationClick(notification: any): void {
    if (!notification.is_read) {
      this.markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.doubt_id) {
      this.router.navigate(['/doubts', notification.doubt_id]);
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'answer':
        return 'icon-answer';
      case 'comment':
        return 'icon-comment';
      case 'vote':
        return 'icon-vote';
      case 'accepted':
        return 'icon-accepted';
      default:
        return 'icon-answer';
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'answer':
        return '💬';
      case 'comment':
        return '💭';
      case 'vote':
        return '👍';
      case 'accepted':
        return '✓';
      default:
        return '🔔';
    }
  }
}
