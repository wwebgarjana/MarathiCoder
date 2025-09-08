import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule',
  standalone: true,
  templateUrl: './schedule.html',
  styleUrls: ['./schedule.css'],
  imports: [FormsModule, CommonModule]
})
export class Schedule implements OnInit {

  schedule: any = {
    courseName: '',
    topicName: '',
    startTime: '',
    endTime: '',
    date: ''
  };

  message: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  addSchedule() {
  const token = localStorage.getItem("token");  // ✅ get JWT from localStorage
  if (!token) {
    this.message = "❌ Please login first!";
    return;
  }

  if (!this.schedule.courseName || !this.schedule.topicName || !this.schedule.startTime || !this.schedule.endTime || !this.schedule.date) {
    this.message = "❌ Please fill all fields!";
    return;
  }

  // ✅ request body (no need for trainerEmail, backend takes trainer from JWT)
  const scheduleRequest = {
    courseName: this.schedule.courseName,
    topicName: this.schedule.topicName,
    startTime: this.schedule.startTime,
    endTime: this.schedule.endTime,
    date: this.schedule.date
  };

  this.http.post("http://localhost:8082/api/schedules/create", scheduleRequest, {
    headers: { Authorization: `Bearer ${token}` }   // ✅ send token
  }).subscribe({
    next: (res: any) => {
      console.log("✅ Schedule Created:", res);
      this.message = "✅ Schedule created successfully!";
      this.schedule = { courseName: '', topicName: '', startTime: '', endTime: '', date: '' }; // reset form
    },
    error: (err) => {
      console.error("❌ Error creating schedule:", err);
      this.message = "❌ Failed to create schedule!";
    }
  });
}

}
