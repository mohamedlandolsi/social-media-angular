import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserSettingsDropdownComponent } from './user-settings-dropdown/user-settings-dropdown.component';
import { PostComponent } from './post/post.component';
import { SuggestedUsersComponent } from './suggested-users/suggested-users.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProfileComponent } from './profile/profile.component';
import { LogoComponent } from './logo/logo.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsComponent } from './settings/settings.component';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { FeedSearchComponent } from './feed-search/feed-search.component';
import { AdvancedFilterComponent } from './advanced-filter/advanced-filter.component';
import { SortByComponent } from './sort-by/sort-by.component';
import { UsersComponent } from './AdminDashboard/users/users.component';
import { PostsComponent } from './AdminDashboard/posts/posts.component';
import { DashboardComponent } from './AdminDashboard/dashboard/dashboard.component';
import { UpdateUserModalComponent } from './AdminDashboard/update-user-modal/update-user-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    NavbarComponent,
    UserSettingsDropdownComponent,
    PostComponent,
    SuggestedUsersComponent,
    SidebarComponent,
    ProfileComponent,
    LogoComponent,
    CreatePostComponent,
    SettingsComponent,
    ThemeToggleComponent,
    FeedSearchComponent,
    AdvancedFilterComponent,
    SortByComponent,
    UsersComponent,
    PostsComponent,
    DashboardComponent,
    UpdateUserModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right', // Position of the toast
      timeOut: 3000, // Duration in milliseconds
      preventDuplicates: true, // Prevent duplicate toasts
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [provideClientHydration(), provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
