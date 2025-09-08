// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, NgForm } from '@angular/forms';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { finalize } from 'rxjs/operators';

// interface FeedbackPayload {
//   studentName: string;
//   studentId: string;
//   course: string;
//   batch: string;
//   lectureTitle: string;
//   rating: number;
//   comments: string;
// }

// @Component({
//   selector: 'app-feedback',
//   standalone: true,
//   imports: [CommonModule, FormsModule, HttpClientModule],
//   templateUrl: './feedback.html',
//    styleUrls: ['./feedback.css']
// })
// export class Feedback {
//   courses = ['Java Full Stack', 'Python Backend', 'React.js'];
//   batches = ['Batch A', 'Batch B', 'Batch C'];

//   model: FeedbackPayload = {
//     studentName: '',
//     studentId: '',
//     course: '',
//     batch: '',
//     lectureTitle: '',
//     rating: 5,
//     comments: ''
//   };

//   message = '';
//   submitting = false;

//   private apiUrl = 'http://localhost:8082/api/feedback';

//   constructor(private http: HttpClient) {}

//   onSubmit(form: NgForm) {
//     this.message = '';
//     if (form.invalid) {
//       this.message = 'Please fill all required fields.';
//       return;
//     }

//     this.submitting = true;
//     this.http.post(this.apiUrl, this.model).pipe(
//       finalize(() => this.submitting = false)
//     ).subscribe({
//       next: (res) => {
//         this.message = '✅ Feedback submitted. Thank you!';
//         form.resetForm({ rating: 5 });
//       },
//       error: (err) => {
//         console.error('Submit error:', err);
//         this.message = '❌ Failed to submit feedback. Try again later.';
//       }
//     });
//   }
// }


// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, NgForm } from '@angular/forms';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { finalize } from 'rxjs/operators';

// interface FeedbackPayload {
//   studentName: string;
//   studentId: string;
//   course: string;
//   batch: string;
//   lectureTitle: string;
//   rating: number;
//   comments: string;
// }

// @Component({
//   selector: 'app-feedback',
//   standalone: true,
//   imports: [CommonModule, FormsModule, HttpClientModule],
//   templateUrl: './feedback.html',
//   styleUrls: ['./feedback.css']
// })
// export class Feedback {
//   courses = ['Java Full Stack', 'Python Backend', 'React.js'];
//   batches = ['Batch A', 'Batch B', 'Batch C'];

//   model: FeedbackPayload = {
//     studentName: '',
//     studentId: '',
//     course: '',
//     batch: '',
//     lectureTitle: '',
//     rating: 5,
//     comments: ''
//   };

//   message = '';
//   submitting = false;

//   private apiUrl = 'http://localhost:8082/api/feedback';

//   constructor(private http: HttpClient) {}

//   onSubmit(form: NgForm) {
//     this.message = '';
//     if (form.invalid) {
//       this.message = '❌ Please fill all required fields.';
//       return;
//     }

//     this.submitting = true;
//     this.http.post(this.apiUrl, this.model).pipe(
//       finalize(() => this.submitting = false)
//     ).subscribe({
//       next: () => {
//         this.message = '✅ Feedback submitted successfully!';
//         form.resetForm({ rating: 5 });
//       },
//       error: (err) => {
//         console.error('Submit error:', err);
//         this.message = '❌ Failed to submit feedback. Only assigned trainer can receive.';
//       }
//     });
//   }
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

interface FeedbackPayload {
  studentName: string;
  studentId: string;
  course: string;
  batch: string;
  lectureTitle: string;
  rating: number;
  comments: string;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.css']
})
export class Feedback {
  courses = ['Java Full Stack', 'Python Backend', 'React.js'];
  batches = ['Batch A', 'Batch B', 'Batch C'];

  model: FeedbackPayload = {
    studentName: '',
    studentId: '',
    course: '',
    batch: '',
    lectureTitle: '',
    rating: 5,
    comments: ''
  };

  message = '';
  submitting = false;

  private apiUrl = 'http://localhost:8082/api/feedback';

  constructor(private http: HttpClient) {}

  onSubmit(form: NgForm) {
    this.message = '';
    if (form.invalid) {
      this.message = '❌ Please fill all required fields.';
      return;
    }

    // ✅ Get token from localStorage (or wherever you stored it after login)
    const token = localStorage.getItem('token');
    if (!token) {
      this.message = '❌ You are not logged in. Please log in first.';
      return;
    }

    // ✅ Add Authorization header
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.submitting = true;
    this.http.post(this.apiUrl, this.model, { headers }).pipe(
      finalize(() => this.submitting = false)
    ).subscribe({
      next: () => {
        this.message = '✅ Feedback submitted successfully!';
        form.resetForm({ rating: 5 });
      },
      error: (err) => {
        console.error('Submit error:', err);
        this.message = '❌ Failed to submit feedback. Only assigned trainer can receive.';
      }
    });
  }
}
