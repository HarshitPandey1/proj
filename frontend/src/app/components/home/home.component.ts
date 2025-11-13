import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoubtService } from '../../services/doubt.service';
import { Doubt } from '../../models/doubt.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  recentDoubts: Doubt[] = [];
  loading: boolean = true;

  constructor(
    private doubtService: DoubtService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecentDoubts();
  }

  loadRecentDoubts(): void {
    this.doubtService.getDoubts({ limit: 10 }).subscribe({
      next: (response) => {
        this.recentDoubts = response.doubts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading doubts:', error);
        this.loading = false;
      }
    });
  }

  viewDoubt(id: number): void {
    this.router.navigate(['/doubts', id]);
  }
}
