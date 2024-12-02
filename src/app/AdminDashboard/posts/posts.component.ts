import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { PostComponent } from '../../post/post.component';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent extends PostComponent implements OnInit {
  error: string | null = null;

  constructor(private http: HttpClient, authService: AuthService) {
    super(http,authService);
  }
}
