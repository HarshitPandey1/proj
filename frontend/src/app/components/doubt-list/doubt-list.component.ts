import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoubtService } from '../../services/doubt.service';
import { CommonService } from '../../services/common.service';
import { Doubt } from '../../models/doubt.model';
import { Subject } from '../../models/common.model';

@Component({
  selector: 'app-doubt-list',
  templateUrl: './doubt-list.component.html',
  styleUrls: ['./doubt-list.component.css']
})
export class DoubtListComponent implements OnInit {
  doubts: Doubt[] = [];
  subjects: Subject[] = [];
  
  // Filters
  searchQuery = '';
  selectedSubject = '';
  selectedStatus = '';
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  pageSize = 12;
  
  loading = false;

  constructor(
    private doubtService: DoubtService,
    private commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
    this.loadDoubts();
  }

  loadSubjects(): void {
    this.commonService.getSubjects().subscribe({
      next: (response) => {
        this.subjects = response.subjects;
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
      }
    });
  }

  loadDoubts(): void {
    this.loading = true;
    
    const filters = {
      search: this.searchQuery || undefined,
      subject_id: this.selectedSubject || undefined,
      status: this.selectedStatus || undefined,
      page: this.currentPage,
      limit: this.pageSize
    };

    this.doubtService.getDoubts(filters).subscribe({
      next: (response) => {
        this.doubts = response.doubts;
        // Add id alias for template compatibility
        this.doubts.forEach(doubt => {
          doubt.id = doubt.doubt_id;
          doubt.student_name = doubt.author_name;
          doubt.view_count = doubt.views_count;
        });
        this.totalPages = Math.ceil(response.count / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading doubts:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadDoubts();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadDoubts();
  }

  viewDoubt(doubtId: number): void {
    this.router.navigate(['/doubts', doubtId]);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadDoubts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadDoubts();
    }
  }
}
