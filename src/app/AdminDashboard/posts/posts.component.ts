import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  posts: any[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.loading = true;
    this.error = null;

    this.http.get<any[]>('http://localhost:3000/posts/all').subscribe(
      (data) => {
        this.posts = data;
        this.loading = false;
      },
      (err) => {
        console.error('Error fetching posts:', err);
        this.error = 'Failed to load posts.';
        this.loading = false;
      }
    );
  }

  deletePost(postId: string): void {
    this.http.delete(`http://localhost:3000/posts/${postId}`).subscribe(
      () => {
        this.posts = this.posts.filter((post) => post._id !== postId);
      },
      (err) => {
        console.error('Error deleting post:', err);
        alert('Failed to delete the post.');
      }
    );
  }
}
