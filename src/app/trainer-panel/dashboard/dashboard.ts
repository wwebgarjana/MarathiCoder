import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-dashboard',
   standalone: true,
   imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
   constructor(private router: Router) {}

  logout(): void {
    // Clear stored session/token data
    localStorage.clear(); // or localStorage.removeItem('token') if needed

    // Navigate to the home or login page
    this.router.navigate(['/home']); // or '/login' depending on your routes
  }

 

goToProfile(): void {
  this.router.navigate(['/trainer-panel/dashboard/profile']);
}
onDashboardClick(): void {
  this.router.navigate(['/trainer-panel/dashboard/home']);
}
onBatchClick(): void {
  this.router.navigate(['/trainer-panel/dashboard/my-batches']);
}
onJobUpdatesClick(): void {
  this.router.navigate(['/trainer-panel/dashboard/job-updates']);
}
onProgressClick(): void {
  this.router.navigate(['/trainer-panel/dashboard/student-progress-tracker']);
}
onProjectClick(): void {
  this.router.navigate(['/trainer-panel/dashboard/project']);
}
onAttendanceClick(): void {
  this.router.navigate(['/trainer-panel/dashboard/attendance']);
}
onDoubtClick(): void {
  this.router.navigate(['/trainer-panel/dashboard/doubt']);
}
onFeedbackClick(): void {
  this.router.navigate(['/trainer-panel/dashboard/feedback']);
}

onScheduleClick(): void {
  this.router.navigate(['/trainer-panel/dashboard/schedule']);
}

userEmail: string | null = null;

ngOnInit(): void {
  this.userEmail = localStorage.getItem('userEmail');
}

}
