


// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-attendance',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './attendance.html',
//   styleUrls: ['./attendance.css']
// })
// export class Attendance implements OnInit {

//   trainerId: string = '';
//   batches: string[] = [];
//   selectedBatch: string = '';
//   selectedDate: string = '';
//   students: any[] = [];
//   attendanceMap: { [studentId: string]: string } = {}; 
//   submittedAttendance: any[] = [];
//   attendanceAlreadyDone: boolean = false; // NEW flag

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     const email = localStorage.getItem('userEmail');
//     if (email) {
//       this.http.get<any>(`http://localhost:8082/api/trainers/profile?email=${email}`)
//         .subscribe(res => {
//           this.trainerId = res.trainerId;
//           this.http.get<string[]>(`http://localhost:8082/attendance/batches/${this.trainerId}`)
//             .subscribe(batches => this.batches = batches);
//         });
//     }
//   }


//   onBatchOrDateChange() {
//   if (this.selectedBatch && this.selectedDate) {
//     this.http.get<any>(`http://localhost:8082/attendance/students/${this.trainerId}/${this.selectedBatch}/${this.selectedDate}`)
//       .subscribe(res => {
//         this.students = res.students || [];
//         this.attendanceAlreadyDone = res.alreadyMarked;

//         if (this.attendanceAlreadyDone) {
//           this.submittedAttendance = this.students;
//         } else {
//           this.attendanceMap = {};
//           this.students.forEach(s => this.attendanceMap[s.studentId] = 'present');
//           this.submittedAttendance = [];
//         }
//       });
//   }
// }


//   markAttendance() {
//     if (this.attendanceAlreadyDone) {
//       alert("Attendance is already done for today!");
//       return;
//     }

//     const attendanceList = this.students.map(s => ({
//       studentId: s.studentId,
//       studentName: s.studentName,
//       trainerId: this.trainerId,
//       trainerCourse: s.trainerCourse,
//       batches: this.selectedBatch,
//       assignedDate: this.selectedDate,
//       status: this.attendanceMap[s.studentId] === 'present'
//     }));

//     this.http.post<{ message: string }>(`http://localhost:8082/attendance/mark`, attendanceList)
//       .subscribe({
//         next: (res) => {
//           alert(res.message);
//           this.submittedAttendance = attendanceList;
//           this.attendanceAlreadyDone = true;
//         },
//         error: (err) => {
//           console.error('Error marking attendance:', err);
//           alert('Failed to mark attendance!');
//         }
//       });
//   }
// }



import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.css']
})
export class Attendance implements OnInit {

  trainerId: string = '';
  batches: string[] = [];
  selectedBatch: string = '';
  selectedDate: string = '';
  students: any[] = [];
  attendanceMap: { [studentId: string]: string } = {}; 
  submittedAttendance: any[] = [];
  attendanceAlreadyDone: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.http.get<any>(`http://localhost:8082/api/trainers/profile?email=${email}`)
        .subscribe(res => {
          this.trainerId = res.trainerId;
          this.http.get<string[]>(`http://localhost:8082/attendance/batches/${this.trainerId}`)
            .subscribe(batches => this.batches = batches);
        });
    }
  }

  onBatchOrDateChange() {
    if (this.selectedBatch && this.selectedDate) {
      this.http.get<any>(`http://localhost:8082/attendance/students/${this.trainerId}/${this.selectedBatch}/${this.selectedDate}`)
        .subscribe(res => {
          this.students = res.students || [];
          this.attendanceAlreadyDone = res.alreadyMarked;

          if (this.attendanceAlreadyDone) {
            // ✅ Only show submitted data
            this.submittedAttendance = this.students;
          } else {
            // ✅ Show radio buttons to mark fresh attendance
            this.attendanceMap = {};
            this.students.forEach(s => this.attendanceMap[s.studentId] = 'present');
            this.submittedAttendance = [];
          }
        });
    }
  }

  markAttendance() {
    if (this.attendanceAlreadyDone) {
      alert("Attendance is already done for today!");
      return;
    }

    const attendanceList = this.students.map(s => ({
      studentId: s.studentId,
      studentName: s.studentName,
      trainerId: this.trainerId,
      batchName: this.selectedBatch,
      date: this.selectedDate,
      status: this.attendanceMap[s.studentId]
    }));

    this.http.post<any>(`http://localhost:8082/attendance/mark`, attendanceList)
      .subscribe({
        next: (res) => {
          alert(res.message);
          this.submittedAttendance = res.students;
          this.attendanceAlreadyDone = true;
        },
        error: (err) => {
          console.error('Error marking attendance:', err);
          alert('Failed to mark attendance!');
        }
      });
  }
}
