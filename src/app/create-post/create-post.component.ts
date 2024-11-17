import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  accordionOpen: boolean = false;
  newPost = {
    title: '',
    description: '',
    category: '',
    image: '',
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  toggleAccordion(): void {
    this.accordionOpen = !this.accordionOpen;
  }

  createPost(): void {
    const userId = this.authService.getUserId();
    const token = this.authService.getToken();

    if (!token || !userId) {
      this.toastr.error('User not authenticated. Please log in.', 'Error');
      return;
    }

    const postPayload = {
      userId: userId,
      title: this.newPost.title,
      description: this.newPost.description,
      category: this.newPost.category,
      image: this.newPost.image,
    };

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .post('http://localhost:3000/api/post/', postPayload, { headers })
      .subscribe({
        next: (response) => {
          console.log('Post created:', response);
          this.toastr.success('Post created successfully!', 'Success');
          this.accordionOpen = false;
          this.newPost.description = '';
          this.newPost.image = '';
        },
        error: (err) => {
          console.error('Error creating post:', err);
          this.toastr.error('Failed to create post.', 'Error');
        },
      });
  }
}
