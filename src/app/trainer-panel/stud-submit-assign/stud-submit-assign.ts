

// import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-stud-submit-assign',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './stud-submit-assign.html',
//   styleUrls: ['./stud-submit-assign.css']
// })
// export class StudSubmitAssign implements OnInit {
//   submittedAssignments: any[] = [];

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.fetchSubmittedAssignments();
//   }

//   fetchSubmittedAssignments(): void {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('❌ Please login first');
//       return;
//     }

//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

//     this.http.get<any[]>('http://localhost:8082/api/submitted-assignments/all', { headers })
//       .subscribe({
//         next: (data) => {
//           // Map title and studentName from backend
//          this.submittedAssignments = data.map(a => ({
//   ...a,
//   topic: a.topic ,
//   studentName: a.studentName || a.studentEmail,
//   fileUrl: `http://localhost:8082${a.fileUrl}`
// }));

//         },
//         error: (err) => {
//           console.error('Error fetching submitted assignments:', err);
//           alert('❌ Failed to load submitted assignments.');
//         }
//       });
//   }

//   downloadFile(url: string, fileName: string) {
//     if (!fileName) fileName = 'submission.pdf';

//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('❌ Please login first');
//       return;
//     }

//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

//     this.http.get(url, { headers, responseType: 'blob' }).subscribe({
//       next: (blob: Blob) => {
//         const downloadLink = document.createElement('a');
//         const urlBlob = window.URL.createObjectURL(blob);
//         downloadLink.href = urlBlob;
//         downloadLink.download = fileName;
//         document.body.appendChild(downloadLink);
//         downloadLink.click();
//         document.body.removeChild(downloadLink);
//         window.URL.revokeObjectURL(urlBlob);
//       },
//       error: (err) => {
//         console.error('Download failed', err);
//         alert('❌ Failed to download file');
//       }
//     });
//   }
// }



import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stud-submit-assign',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stud-submit-assign.html',
  styleUrls: ['./stud-submit-assign.css']
})
export class StudSubmitAssign implements OnInit {
  submittedAssignments: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchSubmittedAssignments();
  }

  fetchSubmittedAssignments(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ Please login first');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:8082/api/submitted-assignments/all', { headers })
      .subscribe({
        next: (data) => {
          // Map backend data to frontend fields
          this.submittedAssignments = data.map(a => ({
            id: a.id,
            topic: a.topic || 'Untitled',          // assignment title
            studentName: a.studentName || a.studentEmail, // show email if name unavailable
            fileName: a.fileName,
            fileUrl: `http://localhost:8082${a.fileUrl}`
          }));
        },
        error: (err) => {
          console.error('Error fetching submitted assignments:', err);
          alert('❌ Failed to load submitted assignments.');
        }
      });
  }

  downloadFile(url: string, fileName: string) {
    if (!fileName) fileName = 'submission.pdf';

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
      error: (err) => {
        console.error('Download failed', err);
        alert('❌ Failed to download file');
      }
    });
  }
}
