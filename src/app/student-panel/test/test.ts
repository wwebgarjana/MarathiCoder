// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-test',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule, FormsModule],
//   templateUrl: './test.html',
//   styleUrls: ['./test.css']
// })
// export class Test implements OnInit {
//   testStarted = false;
//   testSubmitted = false;
//   scores: number[] = [];
//   quizzes: any[] = [];
//   selectedQuiz: any = null;
//   selectedQuizIndex: number = -1;
//   currentQuestionIndex = 0;
//   loading = true;

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.fetchQuizzes();
//   }

//   fetchQuizzes() {
//     this.http.get('http://localhost:8082/quiz/getall').subscribe({
//       next: (data: any) => {
//         if (Array.isArray(data) && data.length > 0) {
//           this.quizzes = data;
//           this.scores = Array(this.quizzes.length).fill(null);
//         } else {
//           console.error("Quiz list is empty");
//         }
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error("Error fetching quizzes:", err);
//         this.loading = false;
//       }
//     });
//   }

//   selectQuiz(quiz: any, index: number) {
//     this.selectedQuiz = JSON.parse(JSON.stringify(quiz)); // deep copy to reset answers
//     this.selectedQuizIndex = index;
//     this.testStarted = false;
//     this.testSubmitted = false;
//     this.currentQuestionIndex = 0;

//     // ✅ Clear any previous answers for a fresh attempt
//     if (this.selectedQuiz && this.selectedQuiz.questions) {
//       this.selectedQuiz.questions.forEach((q: any) => q.selectedAnswer = null);
//     }
//   }

//   startTest() {
//     if (!this.selectedQuiz || !this.selectedQuiz.questions) {
//       alert("Quiz is not loaded yet.");
//       return;
//     }
//     this.testStarted = true;
//     this.testSubmitted = false;
//     this.currentQuestionIndex = 0;
//   }

//   nextQuestion() {
//     if (this.currentQuestionIndex < this.selectedQuiz.questions.length - 1) {
//       this.currentQuestionIndex++;
//     }
//   }

//   prevQuestion() {
//     if (this.currentQuestionIndex > 0) {
//       this.currentQuestionIndex--;
//     }
//   }

//   submitTest() {
//     let score = 0;
//     this.selectedQuiz.questions.forEach((q: any) => {
//       if (q.selectedAnswer === q.correctAnswer) {
//         score++;
//       }
//     });
//     this.scores[this.selectedQuizIndex] = score;
//     this.testSubmitted = true;
//     this.testStarted = false;
//   }

//   goBackToList() {
//     this.selectedQuiz = null;
//     this.testSubmitted = false;
//     this.testStarted = false;
//     this.currentQuestionIndex = 0;
//   }
// }



// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-test',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule, FormsModule],
//   templateUrl: './test.html',
//   styleUrls: ['./test.css']
// })
// export class Test implements OnInit {
//   testStarted = false;
//   testSubmitted = false;
//   scores: number[] = [];
//   quizzes: any[] = [];
//   selectedQuiz: any = null;
//   selectedQuizIndex: number = -1;
//   currentQuestionIndex = 0;
//   loading = true;

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.fetchQuizzes();
//   }

//   fetchQuizzes() {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.error("❌ No JWT token found in localStorage");
//       this.loading = false;
//       return;
//     }

//     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

//     this.http.get<any[]>('http://localhost:8082/api/quizzes/student', { headers })
//       .subscribe({
//         next: (data) => {
//           if (Array.isArray(data) && data.length > 0) {
//             this.quizzes = data.map((q, i) => ({
//               id: q.id,
//               title: q.title || 'Quiz ' + (i + 1),
//               description: q.description,
//               questions: q.questions || []
//             }));
//             this.scores = Array(this.quizzes.length).fill(null);
//           } else {
//             console.warn("⚠️ Quiz list is empty");
//           }
//           this.loading = false;
//         },
//         error: (err) => {
//           console.error("❌ Error fetching quizzes:", err);
//           this.loading = false;
//         }
//       });
//   }

//   selectQuiz(quiz: any, index: number) {
//     this.selectedQuiz = JSON.parse(JSON.stringify(quiz));
//     this.selectedQuizIndex = index;
//     this.testStarted = false;
//     this.testSubmitted = false;
//     this.currentQuestionIndex = 0;

//     if (this.selectedQuiz?.questions) {
//       this.selectedQuiz.questions.forEach((q: any) => q.selectedAnswer = null);
//     }
//   }

//   startTest() {
//     if (!this.selectedQuiz || !this.selectedQuiz.questions) return;
//     this.testStarted = true;
//     this.testSubmitted = false;
//     this.currentQuestionIndex = 0;
//   }

//   nextQuestion() {
//     if (this.currentQuestionIndex < this.selectedQuiz.questions.length - 1) {
//       this.currentQuestionIndex++;
//     }
//   }

//   prevQuestion() {
//     if (this.currentQuestionIndex > 0) {
//       this.currentQuestionIndex--;
//     }
//   }

//   submitTest() {
//     if (!this.selectedQuiz || !this.selectedQuiz.questions) return;

//     let score = 0;
//     this.selectedQuiz.questions.forEach((q: any) => {
//       if (q.selectedAnswer === q.correctAnswer) score++;
//     });

//     this.scores[this.selectedQuizIndex] = score;
//     this.testSubmitted = true;
//     this.testStarted = false;

//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

//     const submissionPayload = {
//       quizId: this.selectedQuiz.id,
//       answers: this.selectedQuiz.questions.map((q: any) => ({
//         questionId: q.id,
//         selectedAnswer: q.selectedAnswer
//       }))
//     };

//     this.http.post('http://localhost:8082/api/quizzes/submit', submissionPayload, { headers })
//       .subscribe({
//         next: (res) => console.log("✅ Submission saved:", res),
//         error: (err) => console.error("❌ Error saving submission:", err)
//       });
//   }

//   goBackToList() {
//     this.selectedQuiz = null;
//     this.testSubmitted = false;
//     this.testStarted = false;
//     this.currentQuestionIndex = 0;
//   }
// }



// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';

// interface Question {
//   id: number;
//   questionText: string;
//   options: string[];
//   correctAnswer: string;
//   selectedAnswer?: string | null;
// }

// interface Quiz {
//   id: number;
//   title: string;
//   description: string;
//   questions: Question[];
// }

// @Component({
//   selector: 'app-test',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule, FormsModule],
//   templateUrl: './test.html',
//   styleUrls: ['./test.css']
// })
// export class Test implements OnInit {
//   testStarted = false;
//   testSubmitted = false;
//   scores: number[] = [];
//   quizzes: Quiz[] = [];
//   selectedQuiz: Quiz | null = null;
//   selectedQuizIndex = -1;
//   currentQuestionIndex = 0;
//   loading = true;

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.fetchQuizzes();
//   }

//   fetchQuizzes() {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.error('❌ No JWT token found in localStorage');
//       this.loading = false;
//       return;
//     }

//     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

//     this.http.get<Quiz[]>('http://localhost:8082/api/quizzes/student', { headers }).subscribe({
//       next: (data) => {
//         if (Array.isArray(data) && data.length > 0) {
//           this.quizzes = data.map((q, i) => ({
//             id: q.id,
//             title: q.title || `Quiz ${i + 1}`,
//             description: q.description,
//             questions: (q.questions || []).map(qt => ({
//               id: qt.id,
//               questionText: qt.questionText,
//               options: qt.options || [],
//               correctAnswer: qt.correctAnswer,
//               selectedAnswer: null
//             }))
//           }));
//           this.scores = Array(this.quizzes.length).fill(null);
//         } else {
//           console.warn('⚠️ Quiz list is empty');
//         }
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('❌ Error fetching quizzes:', err);
//         this.loading = false;
//       }
//     });
//   }

//   selectQuiz(quiz: Quiz, index: number) {
//     this.selectedQuiz = JSON.parse(JSON.stringify(quiz)); // deep copy
//     this.selectedQuizIndex = index;
//     this.testStarted = false;
//     this.testSubmitted = false;
//     this.currentQuestionIndex = 0;

//     this.selectedQuiz?.questions?.forEach(q => q.selectedAnswer = null);
//   }

//   startTest() {
//     if (!this.selectedQuiz?.questions || this.selectedQuiz.questions.length === 0) {
//       alert('⚠️ Quiz is not loaded yet.');
//       return;
//     }
//     this.testStarted = true;
//     this.testSubmitted = false;
//     this.currentQuestionIndex = 0;
//   }

//   nextQuestion() {
//     if (this.selectedQuiz && this.currentQuestionIndex < this.selectedQuiz.questions.length - 1) {
//       this.currentQuestionIndex++;
//     }
//   }

//   prevQuestion() {
//     if (this.currentQuestionIndex > 0) {
//       this.currentQuestionIndex--;
//     }
//   }

//   submitTest() {
//     if (!this.selectedQuiz?.questions) return;

//     let score = 0;
//     this.selectedQuiz.questions.forEach(q => {
//       if (q.selectedAnswer === q.correctAnswer) score++;
//     });

//     this.scores[this.selectedQuizIndex] = score;
//     this.testSubmitted = true;
//     this.testStarted = false;

//     // Submit answers to backend
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
//     const payload = {
//       quizId: this.selectedQuiz.id,
//       answers: this.selectedQuiz.questions.map(q => ({
//         questionId: q.id,
//         selectedAnswer: q.selectedAnswer
//       }))
//     };

//     this.http.post('http://localhost:8082/api/quizzes/submit', payload, { headers })
//       .subscribe({
//         next: res => console.log('✅ Submission saved:', res),
//         error: err => console.error('❌ Error saving submission:', err)
//       });
//   }

//   goBackToList() {
//     this.selectedQuiz = null;
//     this.testSubmitted = false;
//     this.testStarted = false;
//     this.currentQuestionIndex = 0;
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer?: string | null;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  completed?: boolean; // mark if already submitted
}

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './test.html',
  styleUrls: ['./test.css']
})
export class Test implements OnInit {
  testStarted = false;
  testSubmitted = false;
  scores: number[] = [];
  quizzes: Quiz[] = [];
  selectedQuiz: Quiz | null = null;
  selectedQuizIndex: number = -1; // ✅ Ensure this exists
  currentQuestionIndex = 0;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchQuizzes();
  }

  fetchQuizzes() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No JWT token found in localStorage');
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<Quiz[]>('http://localhost:8082/api/quizzes/student', { headers }).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Add completed flag if needed
          this.quizzes = data.map((q, i) => ({
            id: q.id,
            title: q.title || `Quiz ${i + 1}`,
            description: q.description,
            questions: (q.questions || []).map(qt => ({
              id: qt.id,
              questionText: qt.questionText,
              options: qt.options || [],
              correctAnswer: qt.correctAnswer,
              selectedAnswer: null
            })),
            completed: false // default not completed
          }));
          this.scores = Array(this.quizzes.length).fill(null);
        } else {
          console.warn('⚠️ Quiz list is empty');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching quizzes:', err);
        this.loading = false;
      }
    });
  }

  selectQuiz(quiz: Quiz, index: number) {
    if (quiz.completed) {
      alert('⚠️ You have already completed this quiz.');
      return;
    }

    this.selectedQuiz = JSON.parse(JSON.stringify(quiz)); // deep copy
    this.selectedQuizIndex = index;
    this.testStarted = false;
    this.testSubmitted = false;
    this.currentQuestionIndex = 0;

    this.selectedQuiz?.questions?.forEach(q => q.selectedAnswer = null);
  }

  startTest() {
    if (!this.selectedQuiz?.questions || this.selectedQuiz.questions.length === 0) {
      alert('⚠️ Quiz is not loaded yet.');
      return;
    }
    this.testStarted = true;
    this.testSubmitted = false;
    this.currentQuestionIndex = 0;
  }

  nextQuestion() {
    if (this.selectedQuiz && this.currentQuestionIndex < this.selectedQuiz.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitTest() {
    if (!this.selectedQuiz?.questions) return;

    let score = 0;
    this.selectedQuiz.questions.forEach(q => {
      if (q.selectedAnswer === q.correctAnswer) score++;
    });

    this.scores[this.selectedQuizIndex] = score;
    this.testSubmitted = true;
    this.testStarted = false;

    // Mark quiz as completed
    if (this.selectedQuizIndex >= 0) this.quizzes[this.selectedQuizIndex].completed = true;

    // Submit answers to backend
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const payload = {
      quizId: this.selectedQuiz.id,
      answers: this.selectedQuiz.questions.map(q => ({
        questionId: q.id,
        selectedAnswer: q.selectedAnswer
      }))
    };

    this.http.post('http://localhost:8082/api/quizzes/submit', payload, { headers })
      .subscribe({
        next: res => console.log('✅ Submission saved:', res),
        error: err => console.error('❌ Error saving submission:', err)
      });
  }

  goBackToList() {
    this.selectedQuiz = null;
    this.testSubmitted = false;
    this.testStarted = false;
    this.currentQuestionIndex = 0;
  }
}
