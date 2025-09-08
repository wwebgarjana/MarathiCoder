




import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './assignments.html',
  styleUrls: ['./assignments.css']
})
export class Assignments implements OnInit {
  assignmentForm: FormGroup;
  selectedFile!: File;

  @ViewChild('fileInput') fileInput: any;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.assignmentForm = this.fb.group({
      topic: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // No fetching logic
  }

  // File selected
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Upload assignment
  submitAssignment() {
    if (this.assignmentForm.invalid || !this.selectedFile) {
      alert('⚠ All fields are required!');
      return;
    }

    const formData = new FormData();
    formData.append('topic', this.assignmentForm.get('topic')?.value);
    formData.append('description', this.assignmentForm.get('description')?.value);
    formData.append('dueDate', this.assignmentForm.get('dueDate')?.value);
    formData.append('file', this.selectedFile);

    const token = localStorage.getItem('token');
    if (!token) {
      alert("❌ Unauthorized! Please login as trainer.");
      return;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('http://localhost:8082/api/assignments/upload', formData, { headers })
      .subscribe({
        next: () => {
          alert('✅ Assignment uploaded successfully!');
          this.resetForm();
        },
        error: (err) => {
          console.error('❌ Upload error:', err);
          alert('❌ Assignment upload failed!');
        }
      });
  }

  // Reset form
  resetForm() {
    this.assignmentForm.reset();
    this.selectedFile = null!;
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }
}
