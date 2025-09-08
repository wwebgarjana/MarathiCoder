// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-doubt',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './doubt.html',
//   styleUrls: ['./doubt.css']
// })
// export class Doubt {
//   selectedTrainer = '';
//   doubtText = '';
//   studentName = 'Pooja Lakhangave';
//   messages: { sender: string; text: string }[] = [];

//   constructor(private http: HttpClient) {}

//   loadChat() {
//     if (!this.selectedTrainer) return;
//     this.http.get<{ sender: string; text: string }[]>(
//       `http://localhost:8082/api/chat/${this.studentName}/${this.selectedTrainer}`
//     ).subscribe(data => {
//       this.messages = data;
//     });
//   }

//   sendDoubt() {
//     if (!this.doubtText || !this.selectedTrainer) {
//       alert('Please select a trainer and enter your doubt.');
//       return;
//     }

//     const msgObj = {
//       sender: 'student',
//       senderName: this.studentName,
//       receiverName: this.selectedTrainer,
//       text: this.doubtText
//     };

//     this.http.post('http://localhost:8082/api/chat', msgObj)
//       .subscribe(() => {
//         this.doubtText = '';
//         this.loadChat();
//       });
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// interface ChatMsg {
//   sender: 'student' | 'trainer';
//   senderName: string;
//   receiverName: string;
//   message: string;
//   sentAt?: string;
// }

// @Component({
//   selector: 'app-doubt-student',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './doubt.html',
//   styleUrls: ['./doubt.css']
// })
// export class Doubt implements OnInit {
//   selectedTrainer = '';
//   doubtText = '';
//   messages: ChatMsg[] = [];
//   trainers: string[] = [];

//   // pull from your auth after login
//   studentName = localStorage.getItem('studentName') || 'Pooja Lakhangave';
//   studentEmail = localStorage.getItem('studentEmail') || 'pooja@gmail.com';

//   private base = 'http://localhost:8082/api/chat';

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     // load assigned trainers for the logged-in student
//     const params = new HttpParams().set('studentEmail', this.studentEmail);
//     this.http.get<string[]>(`${this.base}/assigned/trainers`, { params })
//       .subscribe(list => this.trainers = list);
//   }

//   loadChat() {
//     if (!this.selectedTrainer) return;
//     this.http.get<ChatMsg[]>(`${this.base}/${this.studentName}/${this.selectedTrainer}`)
//       .subscribe(data => this.messages = data);
//   }

//   sendDoubt() {
//     if (!this.doubtText.trim() || !this.selectedTrainer) return;

//     const msg: ChatMsg = {
//       sender: 'student',
//       senderName: this.studentName,
//       receiverName: this.selectedTrainer,
//       message: this.doubtText
//     };

//     this.http.post<ChatMsg>(this.base, msg)
//       .subscribe({
//         next: () => {
//           this.doubtText = '';
//           this.loadChat();
//         },
//         error: (err) => {
//           alert(err?.error || 'Failed to send. Are you assigned to this trainer?');
//         }
//       });
//   }
// }




import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ChatMsg {
  sender: 'student' | 'trainer';
  senderName: string;
  receiverName: string;
  message: string;
  sentAt?: string;
}

@Component({
  selector: 'app-doubt-student',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './doubt.html',
  styleUrls: ['./doubt.css']
})
export class Doubt implements OnInit {
  selectedTrainer = '';
  doubtText = '';
  messages: ChatMsg[] = [];
  trainers: string[] = [];

  studentEmail: string = '';

  private base = 'http://localhost:8082/api/chat';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // ✅ Get logged-in user email
    const email = localStorage.getItem('userEmail');

    if (!email) {
      alert('User not logged in!');
      return;
    }

    this.studentEmail = email;
    console.log('Logged-in user email:', this.studentEmail);

    // fetch assigned trainers for this student using email
    const params = new HttpParams().set('studentEmail', this.studentEmail);
    this.http.get<string[]>(`${this.base}/assigned/trainers`, { params })
      .subscribe({
        next: (list) => this.trainers = list,
        error: (err) => {
          console.error('Error fetching trainers:', err);
          alert('Failed to load assigned trainers');
        }
      });
  }

  loadChat() {
    if (!this.selectedTrainer) return;

    // load chat using student email
    this.http.get<ChatMsg[]>(`${this.base}/${this.studentEmail}/${this.selectedTrainer}`)
      .subscribe({
        next: (data) => this.messages = data,
        error: (err) => {
          console.error('Error loading chat:', err);
        }
      });
  }

  sendDoubt() {
    if (!this.doubtText.trim() || !this.selectedTrainer) return;

    const msg: ChatMsg = {
      sender: 'student',
      senderName: this.studentEmail,  // use email as senderName
      receiverName: this.selectedTrainer,
      message: this.doubtText
    };

    this.http.post<ChatMsg>(this.base, msg)
      .subscribe({
        next: () => {
          this.doubtText = '';
          this.loadChat(); // reload chat after sending
        },
        error: (err) => {
          console.error('Error sending doubt:', err);
          alert(err?.error || 'Failed to send. Are you assigned to this trainer?');
        }
      });
  }
}

