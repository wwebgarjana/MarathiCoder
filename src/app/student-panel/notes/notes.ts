// import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-notes',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './notes.html',
//   styleUrls: ['./notes.css']
// })
// export class Notes implements OnInit {
//   fetchedNotes: any[] = [];
//   loading = false;
//   errorMsg = '';
//   downloadUrl = 'http://localhost:8082/api/notes/download/';

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.fetchStudentNotes();
//   }

//   fetchStudentNotes() {
//     const token = localStorage.getItem('token');  // ✅ same as videos
//     if (!token) {
//       this.errorMsg = "❌ Please login first!";
//       return;
//     }

//     this.loading = true;
//     this.errorMsg = '';

//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

//     this.http.get<any[]>("http://localhost:8082/api/notes/student", { headers })
//       .subscribe({
//         next: (data) => {
//           this.fetchedNotes = data;
//           this.loading = false;
//         },
//         error: (err) => {
//           console.error("❌ Failed to fetch notes:", err);
//           this.errorMsg = err.error || "❌ Failed to fetch notes";
//           this.loading = false;
//         }
//       });
//   }
// }



import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes.html',
  styleUrls: ['./notes.css']
})
export class Notes implements OnInit {
  fetchedNotes: any[] = [];
  loading = false;
  errorMsg = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStudentNotes();
  }

  fetchStudentNotes() {
    const token = localStorage.getItem('token');  // ✅ use same token key
    if (!token) {
      this.errorMsg = "❌ Please login first!";
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>("http://localhost:8082/api/notes/student", { headers })
      .subscribe({
        next: (data) => {
          this.fetchedNotes = data;   // ✅ backend already sends downloadUrl
          this.loading = false;
        },
        error: (err) => {
          console.error("❌ Failed to fetch notes:", err);
          this.errorMsg = err.error?.message || "❌ Failed to fetch notes";
          this.loading = false;
        }
      });
  }
}
