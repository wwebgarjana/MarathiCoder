import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule',
  standalone: true,
  templateUrl: './schedule.html',
  styleUrls: ['./schedule.css'],
  imports: [CommonModule],
})
export class Schedule implements OnInit {
  schedules: any[] = [];
  loading = false;
  errorMsg = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchSchedules();
  }

  fetchSchedules() {
  const token = localStorage.getItem('token');
  if (!token) {
    this.errorMsg = "❌ Please login first!";
    return;
  }

  this.loading = true;

  this.http.get("http://localhost:8082/api/schedules/student/upcoming", {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe({
    next: (data: any) => {
      this.schedules = data;
      this.loading = false;
    },
    error: (err) => {
      console.error("❌ Failed to fetch schedules:", err);
      this.errorMsg = err.error || "❌ Failed to fetch schedules";
      this.loading = false;
    }
  });
}

}
