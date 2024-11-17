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
