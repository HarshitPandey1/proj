import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DoubtService } from '../../services/doubt.service';
import { CommonService } from '../../services/common.service';
import { Subject } from '../../models/common.model';

@Component({
  selector: 'app-doubt-form',
  templateUrl: './doubt-form.component.html',
  styleUrls: ['./doubt-form.component.css']
})
export class DoubtFormComponent implements OnInit {
  doubtForm: FormGroup;
  subjects: Subject[] = [];
  isEditMode = false;
  doubtId: number | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private doubtService: DoubtService,
    private commonService: CommonService
  ) {
    this.doubtForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      subject_id: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      tags: ['']
    });
  }

  ngOnInit(): void {
    this.loadSubjects();
    
    // Check if editing existing doubt
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.doubtId = +id;
      this.loadDoubt(this.doubtId);
    }
  }

  loadSubjects(): void {
    this.commonService.getSubjects().subscribe({
      next: (response) => {
        this.subjects = response.subjects;
        // Add aliases for template compatibility
        this.subjects.forEach(subject => {
          subject.id = subject.subject_id;
          subject.name = subject.subject_name;
          subject.code = subject.subject_code;
        });
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
      }
    });
  }

  loadDoubt(id: number): void {
    this.doubtService.getDoubtById(id).subscribe({
      next: (response) => {
        const doubt = response.doubt;
        this.doubtForm.patchValue({
          title: doubt.title,
          subject_id: doubt.subject_id,
          description: doubt.description,
          tags: doubt.tags?.join(', ') || ''
        });
        if (doubt.image_url) {
          this.imagePreview = doubt.image_url;
        }
      },
      error: (error) => {
        console.error('Error loading doubt:', error);
        this.errorMessage = 'Failed to load doubt';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select an image file';
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Image size must be less than 5MB';
        return;
      }
      
      this.selectedFile = file;
      
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (this.doubtForm.valid) {
      this.submitting = true;
      this.errorMessage = '';
      
      const formData = new FormData();
      formData.append('title', this.doubtForm.value.title);
      formData.append('subject_id', this.doubtForm.value.subject_id);
      formData.append('description', this.doubtForm.value.description);
      
      // Handle tags
      if (this.doubtForm.value.tags) {
        const tagsArray = this.doubtForm.value.tags.split(',').map((tag: string) => tag.trim());
        formData.append('tags', JSON.stringify(tagsArray));
      }
      
      // Append image if selected
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
      
      if (this.isEditMode && this.doubtId) {
        this.doubtService.updateDoubt(this.doubtId, formData).subscribe({
          next: () => {
            this.router.navigate(['/doubts', this.doubtId]);
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Failed to update doubt';
            this.submitting = false;
          }
        });
      } else {
        this.doubtService.createDoubt(formData).subscribe({
          next: (response) => {
            this.router.navigate(['/doubts', response.doubt.doubt_id]);
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Failed to create doubt';
            this.submitting = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.doubtId) {
      this.router.navigate(['/doubts', this.doubtId]);
    } else {
      this.router.navigate(['/doubts']);
    }
  }
}
