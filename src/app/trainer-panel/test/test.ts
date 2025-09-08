// import { Component, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-test',
//   standalone: true,
//   templateUrl: './test.html',
//   styleUrls: ['./test.css'],
//   imports: [CommonModule, ReactiveFormsModule, FormsModule]
// })
// export class Test implements OnInit {
//   quizForm!: FormGroup;

//   constructor(private fb: FormBuilder, private http: HttpClient) {}

//   ngOnInit(): void {
//     this.quizForm = this.fb.group({
//       quiztitle: ['', Validators.required],
//       quizdescription: ['', Validators.required],
//       questions: this.fb.array([this.createQuestion()])
//     });
//   }

//   get questionArray(): FormArray {
//     return this.quizForm.get('questions') as FormArray;
//   }

//   createQuestion(): FormGroup {
//     return this.fb.group({
//       questionText: ['', Validators.required],
//       options: this.fb.array([
//         this.fb.control('', Validators.required),
//         this.fb.control('', Validators.required),
//         this.fb.control('', Validators.required),
//         this.fb.control('', Validators.required)
//       ]),
//       correctAnswer: ['', Validators.required]
//     });
//   }

//   getOptions(questionIndex: number): FormArray {
//     return this.questionArray.at(questionIndex).get('options') as FormArray;
//   }

//   addQuestion(): void {
//     this.questionArray.push(this.createQuestion());
//   }

//   submitQuiz(): void {
//     if (this.quizForm.valid) {
//       console.log('Sending to backend:', this.quizForm.value);

//       const token = localStorage.getItem('token'); // 🔑 token stored after login
//       if (!token) {
//         alert('❌ No token found! Please log in again.');
//         return;
//       }

//       const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

//       this.http.post('http://localhost:8082/api/quizzes/create', this.quizForm.value, { headers })
//         .subscribe({
//           next: (res) => {
//             alert('✅ Quiz saved successfully!');
//             this.quizForm.reset();
//             this.questionArray.clear();
//             this.addQuestion();
//           },
//           error: (err) => {
//             console.error('❌ Error saving quiz', err);
//             alert('Failed to save quiz!');
//           }
//         });
//     } else {
//       alert('Please fill in all required fields.');
//     }
//   }
// }



import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test',
  standalone: true,
  templateUrl: './test.html',
  styleUrls: ['./test.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class Test implements OnInit {
  quizForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.quizForm = this.fb.group({
      quizTitle: ['', Validators.required],   // ✅ fixed casing
      quizDescription: ['', Validators.required], // ✅ fixed casing
      questions: this.fb.array([this.createQuestion()])
    });
  }

  get questionArray(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  createQuestion(): FormGroup {
    return this.fb.group({
      questionText: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      correctAnswer: ['', Validators.required]
    });
  }

  getOptions(questionIndex: number): FormArray {
    return this.questionArray.at(questionIndex).get('options') as FormArray;
  }

  addQuestion(): void {
    this.questionArray.push(this.createQuestion());
  }

  submitQuiz(): void {
    if (this.quizForm.valid) {
      console.log('Sending to backend:', this.quizForm.value);

      const token = localStorage.getItem('token');
      if (!token) {
        alert('❌ No token found! Please log in again.');
        return;
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post('http://localhost:8082/api/quizzes/create', this.quizForm.value, { headers })
        .subscribe({
          next: () => {
            alert('✅ Quiz saved successfully!');
            this.quizForm.reset();
            this.questionArray.clear();
            this.addQuestion();
          },
          error: (err) => {
            console.error('❌ Error saving quiz', err);
            alert('Failed to save quiz!');
          }
        });
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
