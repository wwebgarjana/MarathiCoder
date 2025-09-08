import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.html',
  styleUrls: ['./notes.css']
})
export class Notes {
  noteTitle: string = '';
  noteDesc: string = '';
  selectedFile!: File;
  message: string = '';   // ✅ For feedback message

  @ViewChild('noteForm') noteForm!: NgForm;
  @ViewChild('fileInput') fileInput: any;

  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadNote() {
    const token = localStorage.getItem('token');  // ✅ JWT from localStorage
    if (!token) {
      this.message = "❌ Unauthorized! Please login as trainer.";
      alert(this.message);
      return;
    }

    if (!this.noteTitle || !this.noteDesc || !this.selectedFile) {
      this.message = "⚠ Please fill all fields!";
      alert(this.message);
      return;
    }

    const formData = new FormData();
    formData.append('title', this.noteTitle);
    formData.append('description', this.noteDesc);
    formData.append('file', this.selectedFile);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post<{ message: string }>(
      'http://localhost:8082/api/notes/upload',
      formData,
      { headers }
    )
    .subscribe({
      next: (res) => {
        console.log("✅ Note Uploaded:", res);
        this.message = res.message || "✅ Note uploaded successfully!";
        alert(this.message);
        this.resetForm();
      },
      error: (err) => {
        console.error("❌ Upload error:", err);
        this.message = "❌ Failed to upload note!";
        alert(this.message);
      }
    });
  }

  resetForm() {
    this.noteTitle = '';
    this.noteDesc = '';
    this.selectedFile = null!;

    if (this.noteForm) {
      this.noteForm.resetForm();
    }
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
