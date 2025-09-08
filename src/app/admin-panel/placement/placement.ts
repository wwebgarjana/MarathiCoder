 
// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
 
// @Component({
//   selector: 'app-placement',
//     imports: [FormsModule,CommonModule],
//   templateUrl: './placement.html',
//   styleUrls: ['./placement.css']
// })
// export class Placement implements OnInit {
//   jobs: any[] = [];   // To store job posts
//   newJob: any = {
//     title: '',
//     companyName: '',
//     description: '',
//     salaryPackage: '',
//     course: ''
//   };
 
//   private baseUrl = 'http://localhost:8082/api/jobs';
 
//   constructor(private http: HttpClient) {}
 
//   ngOnInit(): void {
//     this.getAllJobs(); // Load jobs when component loads
//   }
 
//   // POST new job
//   addJob() {
//     this.http.post(`${this.baseUrl}/post`, this.newJob, { responseType: 'text' })
//       .subscribe({
//         next: (res) => {
//           alert('Job posted successfully!');
//           this.getAllJobs();  // Refresh list
//           this.newJob = { title: '', companyName: '', description: '', salaryPackage: '', course: '' }; // Reset form
//         },
//         error: (err) => {
//           console.error(err);
//           alert('Error while posting job');
//         }
//       });
//   }
 
//   // GET all jobs
//   getAllJobs() {
//     this.http.get<any[]>(`${this.baseUrl}/all`).subscribe({
//       next: (res) => {
//         this.jobs = res;
//       },
//       error: (err) => {
//         console.error(err);
//         alert('Error fetching jobs');
//       }
//     });
//   }
 
//   // ✅ DELETE job by ID
//   deleteJob(id: number) {
//     if (confirm('Are you sure you want to delete this job?')) {
//       this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' })
//         .subscribe({
//           next: (res) => {
//             alert('Job deleted successfully!');
//             this.getAllJobs(); // Refresh list
//           },
//           error: (err) => {
//             console.error(err);
//             alert('Error while deleting job');
//           }
//         });
//     }
//   }
// }
 
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-placement',
  imports: [FormsModule, CommonModule],
  templateUrl: './placement.html',
  styleUrls: ['./placement.css']
})
export class Placement implements OnInit {
  jobs: any[] = [];   // To store job posts
  newJob: any = {
    title: '',
    companyName: '',
    description: '',
    salaryPackage: '',
    course: ''
  };
 
  // ✅ NEW: Applications Report
  applications: any[] = [];
 
  private baseUrl = 'http://localhost:8082/api/jobs';
 
  constructor(private http: HttpClient) {}
 
  ngOnInit(): void {
    this.getAllJobs(); // Load jobs when component loads
  }
 
  // POST new job
  addJob() {
    this.http.post(`${this.baseUrl}/post`, this.newJob, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          alert('Job posted successfully!');
          this.getAllJobs();  // Refresh list
          this.newJob = { title: '', companyName: '', description: '', salaryPackage: '', course: '' }; // Reset form
        },
        error: (err) => {
          console.error(err);
          alert('Error while posting job');
        }
      });
  }
 
  // GET all jobs
  getAllJobs() {
    this.http.get<any[]>(`${this.baseUrl}/all`).subscribe({
      next: (res) => {
        this.jobs = res;
      },
      error: (err) => {
        console.error(err);
        alert('Error fetching jobs');
      }
    });
  }
 
  // ✅ DELETE job by ID
  deleteJob(id: number) {
    if (confirm('Are you sure you want to delete this job?')) {
      this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' })
        .subscribe({
          next: (res) => {
            alert('Job deleted successfully!');
            this.getAllJobs(); // Refresh list
          },
          error: (err) => {
            console.error(err);
            alert('Error while deleting job');
          }
        });
    }
  }
 
  // ✅ NEW: Fetch Applications Report
  getApplicationsReport() {
    this.http.get<any[]>(`${this.baseUrl}/applications-report`).subscribe({
      next: (res) => {
        this.applications = res;
        console.log("Applications Report:", this.applications);
      },
      error: (err) => {
        console.error(err);
        alert('Error fetching applications report');
      }
    });
  }
}
 
 