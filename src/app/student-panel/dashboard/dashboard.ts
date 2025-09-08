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
  this.router.navigate(['/student-panel/dashboard/profile']);
}
userEmail: string | null = null;

ngOnInit(): void {
  this.userEmail = localStorage.getItem('userEmail');
}

}
