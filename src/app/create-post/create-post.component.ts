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
  };
  selectedFile: File | null = null; // Store the selected image file

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  toggleAccordion(): void {
    this.accordionOpen = !this.accordionOpen;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  createPost(): void {
    const userId = this.authService.getUserId();
    const token = this.authService.getToken();

    if (!token || !userId) {
      this.toastr.error('User not authenticated. Please log in.', 'Error');
      return;
    }

    // Create a FormData object to send form data and the image file
    const formData = new FormData();
    formData.append('title', this.newPost.title);
    formData.append('description', this.newPost.description);
    formData.append('category', this.newPost.category);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .post('http://localhost:3000/api/post/', formData, { headers })
      .subscribe({
        next: (response) => {
          console.log('Post created:', response);
          this.toastr.success('Post created successfully!', 'Success');
          this.accordionOpen = false;
          this.newPost = { title: '', description: '', category: '' };
          this.selectedFile = null;
        },
        error: (err) => {
          console.error('Error creating post:', err);
          this.toastr.error('Failed to create post.', 'Error');
        },
      });
  }
}
