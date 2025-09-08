import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  profile: any = {};           // will hold API data
  todaysSchedules: any[] = []; // will hold today’s classes
  totalStudents: number = 0;   // store total student count

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  goToAttendance() {
    this.router.navigate(['/trainer-panel/dashboard/attendance']); 
  }

  goToAssignments() {
    this.router.navigate(['/trainer-panel/dashboard/assignments']); 
  }

  ngOnInit(): void {
    this.loadTrainerProfile();
    this.loadTodaysSchedules();
  }

  // 🔹 Load trainer profile
  loadTrainerProfile() {
    const email = localStorage.getItem("userEmail");

    if (email) {
      const apiUrl = `http://localhost:8082/api/trainers/profile?email=${encodeURIComponent(email)}`;

      this.http.get(apiUrl).subscribe({
        next: (res: any) => {
          console.log("✅ API Response:", res);

          this.profile = res;

          // fallback values
          this.profile.courses = this.profile.courses || "No courses assigned yet.";
          this.profile.batches = this.profile.batches || "No batches assigned yet.";

          // 🔹 Fetch total students for this trainer (after trainerId is available)
          if (this.profile.trainerId) {
            this.http.get<number>(`http://localhost:8082/assign/count/${this.profile.trainerId}`)
              .subscribe(count => {
                this.totalStudents = count;
              });
          }
        },
        error: (err) => {
          console.error("❌ API Error:", err);
        }
      });
    } else {
      console.warn("⚠️ No trainerEmail found in localStorage. Please login again.");
      // this.router.navigate(['/login']);
    }
  }

  // 🔹 Load today’s schedules
  loadTodaysSchedules() {
    const today = new Date().toISOString().split('T')[0]; // e.g. "2025-08-19"
    this.http.get<any[]>(`http://localhost:8082/api/schedules/date/${today}`)
      .subscribe({
        next: (data) => {
          this.todaysSchedules = data;
        },
        error: (err) => {
          console.error("❌ Schedule API Error:", err);
        }
      });
  }
}
