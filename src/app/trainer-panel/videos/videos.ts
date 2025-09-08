


// import { Component, ViewChild } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule, NgForm } from '@angular/forms';

// @Component({
//   selector: 'app-videos',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './videos.html',
//   styleUrls: ['./videos.css']
// })
// export class Videos {
//   title: string = '';
//   description: string = '';
//   selectedFile!: File;

//   @ViewChild('videoForm') videoForm!: NgForm;
//   @ViewChild('fileInput') fileInput: any;

//   constructor(private http: HttpClient) {}

//   onFileChange(event: any) {
//     this.selectedFile = event.target.files[0];
//   }

//   uploadVideo() {
//     if (!this.title || !this.description || !this.selectedFile) {
//       alert('All fields are required!');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('title', this.title);
//     formData.append('description', this.description);
//     formData.append('videoFile', this.selectedFile);

//     this.http.post<{ message: string }>('http://localhost:8082/api/videos/upload', formData)
//       .subscribe({
//         next: (res) => {
//           alert('🎉 ' + (res.message || 'Video uploaded successfully!'));
//           this.resetForm();
//         },
//         error: (err) => {
//           console.error('Upload error:', err);
//           alert('❌ Video upload failed!');
//         }
//       });
//   }

//   resetForm() {
//     this.title = '';
//     this.description = '';
//     this.selectedFile = null!;
//     this.videoForm.resetForm();

//     if (this.fileInput) {
//       this.fileInput.nativeElement.value = '';
//     }
//   }
// }



import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './videos.html',
  styleUrls: ['./videos.css']
})
export class Videos {
  title: string = '';
  description: string = '';
  selectedFile!: File;
  message: string = '';   // ✅ same as Schedule

  @ViewChild('videoForm') videoForm!: NgForm;
  @ViewChild('fileInput') fileInput: any;

  constructor(private http: HttpClient) {}

  // Handle file input
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Upload video (Trainer)
  uploadVideo() {
    const token = localStorage.getItem('token');  // ✅ JWT from localStorage
    if (!token) {
      this.message = "❌ Unauthorized! Please login as trainer.";
      alert(this.message);
      return;
    }

    if (!this.title || !this.description || !this.selectedFile) {
      this.message = "⚠ Please fill all fields!";
      alert(this.message);
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('videoFile', this.selectedFile);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post<{ message: string }>(
      'http://localhost:8082/api/videos/upload',
      formData,
      { headers }
    )
    .subscribe({
      next: (res) => {
        console.log("✅ Video Uploaded:", res);
        this.message = "✅ Video uploaded successfully!";
        alert(this.message);   // ✅ show popup success message
        this.resetForm();
      },
      error: (err) => {
        console.error("❌ Upload error:", err);
        this.message = "❌ Failed to upload video!";
        alert(this.message);
      }
    });
  }

  // Reset form
  resetForm() {
    this.title = '';
    this.description = '';
    this.selectedFile = null!;

    if (this.videoForm) {
      this.videoForm.resetForm();
    }
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
