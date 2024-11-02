import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userId!: string;
  userData: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId')!;
    this.userService.getUserById(this.userId).subscribe((data) => {
      this.userData = data;
      console.log('User Data:', this.userData);
    });
  }
}
