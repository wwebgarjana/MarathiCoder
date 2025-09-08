// // import { Component, OnInit } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';

// // @Component({
// //   selector: 'app-assignments',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule],
// //   templateUrl: './assignments.html',
// //   styleUrls: ['./assignments.css']
// // })
// // export class Assignments implements OnInit {
// //   assignments: any[] = [];
// //   selectedFiles: { [title: string]: File } = {};

// //   constructor(private http: HttpClient) {}

// //   ngOnInit(): void {
// //     this.fetchAssignments();
// //   }

// //   fetchAssignments(): void {
// //     this.http.get<any[]>('http://localhost:8082/api/assignments').subscribe({
// //       next: (data) => this.assignments = data,
// //       error: () => alert('❌ Failed to load assignments.')
// //     });
// //   }

// //   onFileChange(event: any, assignmentTitle: string): void {
// //     const file = event.target.files[0];
// //     if (file) {
// //       this.selectedFiles[assignmentTitle] = file;
// //     }
// //   }

// //   submitAssignmentFile(assignmentTitle: string): void {
// //     const file = this.selectedFiles[assignmentTitle];
// //     if (!file) {
// //       alert('⚠️ Please select a file before submitting.');
// //       return;
// //     }

// //     const formData = new FormData();
// //     formData.append('title', assignmentTitle);
// //     formData.append('file', file);

// //     this.http.post('http://localhost:8082/api/submitted-assignments/submit', formData).subscribe({
// //       next: () => alert('✅ Assignment submitted successfully!'),
// //       error: () => alert('❌ Failed to submit assignment.')
// //     });
// //   }
// // }


// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-assignments',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './assignments.html',
//   styleUrls: ['./assignments.css']
// })
// export class Assignments implements OnInit {
//   assignments: any[] = [];
//   // store file objects keyed by assignment title (or id if you prefer)
//   selectedFiles: { [title: string]: File } = {};
//   // track which titles are submitted
//   submittedTitles: Set<string> = new Set<string>();
//   // map from title -> submitted file URL (returned by backend) so user can view what they submitted
//   submittedFileMap: { [title: string]: string } = {};

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.fetchAssignments();
//     this.loadSubmittedTitlesAndFiles();
//   }

//   fetchAssignments(): void {
//     this.http.get<any[]>('http://localhost:8082/api/assignments').subscribe({
//       next: (data) => this.assignments = data,
//       error: (err) => {
//         console.error('Failed to load assignments', err);
//         alert('❌ Failed to load assignments.');
//       }
//     });
//   }

//   /**
//    * Load previously submitted assignments so UI persists after reload.
//    * Expects returned items to contain at least `title`, `fileUrl`, and optionally `fileName`.
//    */
//   loadSubmittedTitlesAndFiles(): void {
//     this.http.get<any[]>('http://localhost:8082/api/submitted-assignments/all').subscribe({
//       next: (submitted) => {
//         submitted.forEach(s => {
//           if (s.title) {
//             this.submittedTitles.add(s.title);
//             if (s.fileUrl) {
//               this.submittedFileMap[s.title] = s.fileUrl;
//             } else if (s.id) {
//               // fallback if backend returned id but not fileUrl
//               this.submittedFileMap[s.title] = 'http://localhost:8082/api/submitted-assignments/download/' + s.id;
//             }
//           }
//         });
//       },
//       error: (err) => {
//         // optional: log, but don't block the page
//         console.warn('Could not load submitted assignments (optional)', err);
//       }
//     });
//   }

//   onFileChange(event: any, assignmentTitle: string): void {
//     const file = event.target.files[0];
//     if (file) {
//       this.selectedFiles[assignmentTitle] = file;
//     }
//   }

//   submitAssignmentFile(assignmentTitle: string): void {
//     const file = this.selectedFiles[assignmentTitle];
//     if (!file) {
//       alert('⚠️ Please select a file before submitting.');
//       return;
//     }

//     const formData = new FormData();
//     // Backend expects "title" and "file" as form fields
//     formData.append('title', assignmentTitle);
//     formData.append('file', file);

//     this.http.post<any>('http://localhost:8082/api/submitted-assignments/submit', formData).subscribe({
//       next: (res) => {
//         alert('✅ Assignment submitted successfully!');
//         // mark as submitted so upload UI disappears
//         this.submittedTitles.add(assignmentTitle);
//         // store file url if backend returns it (some backends might return created object)
//         if (res && res.fileUrl) {
//           this.submittedFileMap[assignmentTitle] = res.fileUrl;
//         } else {
//           // fallback: request the submitted list again to get fileUrl/id
//           this.refreshSubmittedListForTitle(assignmentTitle);
//         }
//         // cleanup selected file reference
//         delete this.selectedFiles[assignmentTitle];
//       },
//       error: (err) => {
//         console.error('Submission failed', err);
//         alert('❌ Failed to submit assignment.');
//       }
//     });
//   }

//   isSubmitted(title: string): boolean {
//     return this.submittedTitles.has(title);
//   }

//   /**
//    * After submit, refresh submitted assignments to fetch fileUrl for the given title.
//    * Keeps UI consistent.
//    */
//   refreshSubmittedListForTitle(title: string): void {
//     this.http.get<any[]>('http://localhost:8082/api/submitted-assignments/all').subscribe({
//       next: (submitted) => {
//         submitted.forEach(s => {
//           if (s.title === title) {
//             this.submittedTitles.add(title);
//             if (s.fileUrl) {
//               this.submittedFileMap[title] = s.fileUrl;
//             } else if (s.id) {
//               this.submittedFileMap[title] = 'http://localhost:8082/api/submitted-assignments/download/' + s.id;
//             }
//           }
//         });
//       }, error: (err) => {
//         console.warn('Could not refresh submitted list', err);
//       }
//     });
//   }
// }



// import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-assignments',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './assignments.html',
//   styleUrls: ['./assignments.css']
// })
// export class Assignments implements OnInit {
//   assignments: any[] = [];
//   loading = false;
//   errorMsg = '';
//   selectedFiles: { [title: string]: File } = {};
//   submittedTitles: Set<string> = new Set<string>();
//   submittedFileMap: { [title: string]: string } = {};

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.fetchAssignments();
//     this.loadSubmittedAssignments();
//   }

//   fetchAssignments(): void {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       this.errorMsg = '❌ Please login first!';
//       return;
//     }

//     this.loading = true;
//     this.errorMsg = '';
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

//     this.http.get<any[]>('http://localhost:8082/api/assignments/student', { headers })
//       .subscribe({
//         next: (data) => {
//           // Backend should send downloadUrl
//           this.assignments = data.map(a => ({
//             ...a,
//             downloadUrl: `http://localhost:8082/api/assignments/download/${a.id}`
//           }));
//           this.loading = false;
//         },
//         error: (err) => {
//           console.error('❌ Failed to fetch assignments:', err);
//           this.errorMsg = err.error?.message || '❌ Failed to fetch assignments';
//           this.loading = false;
//         }
//       });
//   }

//   loadSubmittedAssignments(): void {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     this.http.get<any[]>('http://localhost:8082/api/submitted-assignments/all', { headers })
//       .subscribe({
//         next: (submitted) => {
//           submitted.forEach(s => {
//             if (s.title) {
//               this.submittedTitles.add(s.title);
//               this.submittedFileMap[s.title] =
//                 s.fileUrl || ('http://localhost:8082/api/submitted-assignments/download/' + s.id);
//             }
//           });
//         },
//         error: (err) => console.warn('Optional: could not load submitted assignments', err)
//       });
//   }

//   onFileChange(event: any, assignmentTitle: string): void {
//     const file = event.target.files[0];
//     if (file) this.selectedFiles[assignmentTitle] = file;
//   }

//   submitAssignmentFile(assignmentTitle: string): void {
//     const file = this.selectedFiles[assignmentTitle];
//     if (!file) {
//       alert('⚠️ Please select a file before submitting.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('title', assignmentTitle);
//     formData.append('file', file);

//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('❌ Unauthorized! Please login.');
//       return;
//     }
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

//     this.http.post<any>('http://localhost:8082/api/submitted-assignments/submit', formData, { headers })
//       .subscribe({
//         next: (res) => {
//           alert('✅ Assignment submitted successfully!');
//           this.submittedTitles.add(assignmentTitle);
//           this.submittedFileMap[assignmentTitle] =
//             res?.fileUrl || ('http://localhost:8082/api/submitted-assignments/download/' + res?.id);
//           delete this.selectedFiles[assignmentTitle];
//         },
//         error: (err) => {
//           console.error('❌ Submit error:', err);
//           alert('❌ Failed to submit assignment.');
//         }
//       });
//   }

//   isSubmitted(title: string): boolean {
//     return this.submittedTitles.has(title);
//   }
// }



import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assignments-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignments.html',
  styleUrls: ['./assignments.css']
})
export class Assignments implements OnInit {
  assignments: any[] = [];
  loading = false;
  errorMsg = '';
  selectedFiles: { [assignmentId: number]: File } = {};
  submittedFileMap: { [assignmentId: number]: { url: string, fileName: string } } = {};
  submittedIds: Set<number> = new Set<number>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAssignments();
    this.loadSubmittedAssignments();
  }

  // Fetch trainer uploaded assignments
  fetchAssignments(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMsg = '❌ Please login first!';
      return;
    }
    this.loading = true;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:8082/api/assignments/student', { headers })
      .subscribe({
        next: data => {
          this.assignments = data.map(a => ({
            ...a,
            downloadUrl: `http://localhost:8082/api/assignments/download/${a.id}`
          }));
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.errorMsg = '❌ Failed to fetch assignments';
          this.loading = false;
        }
      });
  }

  // Load student submitted assignments
  loadSubmittedAssignments(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:8082/api/submitted-assignments/all', { headers })
      .subscribe({
        next: submitted => {
          submitted.forEach(s => {
            this.submittedIds.add(s.assignmentId);
            this.submittedFileMap[s.assignmentId] = { 
              url: `http://localhost:8082${s.fileUrl}`, 
              fileName: s.fileName || `submission_${s.assignmentId}` 
            };
          });
        },
        error: err => console.warn('Could not load submitted assignments', err)
      });
  }

  // Handle file selection
  onFileChange(event: any, assignmentId: number): void {
    const file = event.target.files[0];
    if (file) this.selectedFiles[assignmentId] = file;
  }

  // Submit assignment
  submitAssignmentFile(assignmentId: number): void {
    const file = this.selectedFiles[assignmentId];
    if (!file) {
      alert('⚠️ Please select a file before submitting.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ Please login first');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = new FormData();
    formData.append('assignmentId', assignmentId.toString());
    formData.append('studentId', localStorage.getItem('studentId') || '');
    formData.append('studentEmail', localStorage.getItem('email') || '');
    formData.append('file', file);

    this.http.post<any>('http://localhost:8082/api/submitted-assignments/submit', formData, { headers })
      .subscribe({
        next: res => {
          alert('✅ Assignment submitted!');
          this.submittedIds.add(assignmentId);
          this.submittedFileMap[assignmentId] = { 
            url: `http://localhost:8082${res.fileUrl}`, 
            fileName: res.fileName || `submission_${assignmentId}` 
          };
          delete this.selectedFiles[assignmentId];
        },
        error: err => {
          console.error(err);
          alert('❌ Failed to submit assignment');
        }
      });
  }

  // Check if assignment is already submitted
  isSubmitted(assignmentId: number): boolean {
    return this.submittedIds.has(assignmentId);
  }

  // Download file (trainer or student)
  downloadFile(url: string, fileName: string) {
    if (!fileName) {
      alert('❌ File name is missing!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ Please login first');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(url, { headers, responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const downloadLink = document.createElement('a');
        const urlBlob = window.URL.createObjectURL(blob);
        downloadLink.href = urlBlob;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(urlBlob);
      },
      error: err => {
        console.error('Download failed', err);
        alert('❌ Failed to download file');
      }
    });
  }
}
