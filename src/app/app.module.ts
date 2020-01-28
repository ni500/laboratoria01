import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './core/auth.service';
import { NgMaterialModule } from './core/ng-material.module';
import { LoginComponent } from './login/login.component';
import { DeleteDialogComponent } from './wall/delete-dialog/delete-dialog.component';
import { EditPostComponent } from './wall/edit-post/edit-post.component';
import { WallComponent } from './wall/wall.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WallComponent,
    DeleteDialogComponent,
    EditPostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FlexLayoutModule,
    NgMaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    AngularFireModule.initializeApp(environment.firebase_config),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
  entryComponents: [DeleteDialogComponent]
})
export class AppModule {}
