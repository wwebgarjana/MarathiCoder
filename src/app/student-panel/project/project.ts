// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// interface ProjectModel {
//   id: number;
//   course: string;
//   batch: string;
//   description: string;
//   assignedDate: string;
//   status: string;
//   fileUrl?: string; // Optional
// }

// @Component({
//   selector: 'app-project',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './project.html',
//   styleUrls: ['./project.css']
// })
// export class Project implements OnInit {
//   projects: ProjectModel[] = [];
//   selectedFiles: { [projectId: number]: File | null } = {};

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.loadProjects();
//   }

//   loadProjects() {
//     this.http.get<ProjectModel[]>('http://localhost:8082/api/projects')
//       .subscribe({
//         next: (data) => this.projects = data,
//         error: (err) => console.error('Error loading projects', err)
//       });
//   }

//   onFileChange(event: Event, projectId: number) {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.selectedFiles[projectId] = input.files[0];
//     }
//   }

//   submitProject(projectId: number) {
//     const file = this.selectedFiles[projectId];
//     if (!file) {
//       alert('Please select a file before submitting.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('submissionFile', file);

//     this.http.post(`http://localhost:8082/api/projects/${projectId}/submit`, formData)
//       .subscribe({
//         next: () => {
//           alert('✅ Project Submitted Successfully!');
//           this.selectedFiles[projectId] = null; // Clear after submission
//         },
//         error: (err) => {
//           console.error('Error submitting project', err);
//           alert('❌ Failed to submit project.');
//         }
//       });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProjectModel {
  id: number;
  batch: string;
  course: string;
  description: string;
  status: string;
  downloadUrl?: string;
  submissionFileName?: string;
  submissionDownloadUrl?: string;
  assignedDate: string;
}

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project.html',
  styleUrls: ['./project.css']
})
export class Project implements OnInit {
  projects: ProjectModel[] = [];
  selectedFiles: { [projectId: number]: File } = {};
  submittedFileMap: { [id: number]: string } = {};

  private baseUrl = 'http://localhost:8082/api/projects';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAssignedProjects();
  }

  fetchAssignedProjects(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<ProjectModel[]>(`${this.baseUrl}/student`, { headers })
      .subscribe({
        next: (data) => {
          this.projects = data.map(p => {
            // If project is submitted, store submission download link
            if (p.status === 'Submitted' && p.submissionFileName) {
              this.submittedFileMap[p.id] = `${this.baseUrl}/${p.id}/download/submission`;
            }
            return p;
          });
        },
        error: (err) => console.error('Error fetching assigned projects', err)
      });
  }

  onFileChange(event: any, projectId: number): void {
    const file = event.target.files?.[0];
    if (file) this.selectedFiles[projectId] = file;
  }

  submitProject(projectId: number): void {
    const file = this.selectedFiles[projectId];
    if (!file) { alert('Please select a file'); return; }

    const formData = new FormData();
    formData.append('submissionFile', file);

    const token = localStorage.getItem('token');
    if (!token) { alert('Unauthorized!'); return; }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${this.baseUrl}/${projectId}/submit`, formData, { headers })
      .subscribe({
        next: () => {
          alert('✅ Project submitted successfully!');
          this.submittedFileMap[projectId] = `${this.baseUrl}/${projectId}/download/submission`;
          delete this.selectedFiles[projectId];

          // Update project status locally
          const proj = this.projects.find(p => p.id === projectId);
          if (proj) proj.status = 'Submitted';
        },
        error: (err) => {
          console.error('Submission failed', err);
          alert('❌ Failed to submit project.');
        }
      });
  }

  isSubmitted(projectId: number): boolean {
    return !!this.submittedFileMap[projectId];
  }
}
