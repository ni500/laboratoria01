import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Post } from './../models/post';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WallService {
  constructor(
    private db: AngularFirestore,
    private snackbar: MatSnackBar,
    private afStorage: AngularFireStorage
  ) {}

  getPosts(): Observable<Post[] | unknown> {
    return this.db.collection('posts').valueChanges();
  }

  addPost(post: Post) {
    this.db
      .doc(`posts/${post.id}`)
      .set(post)
      .then(() => this.snackbar.open('Post agregado', 'OK'));
  }

  deletePost(id: string) {
    this.db
      .doc(`posts/${id}`)
      .delete()
      .then(() => {
        this.snackbar.open('Post borrado', 'OK');
      });
  }

  editPost(post: Post) {
    this.db
      .doc(`posts/${post.id}`)
      .set(post, { merge: true })
      .then(() => this.snackbar.open('Post editado', 'OK'));
  }

  filterPosts(path: string, value: string) {
    return this.db
      .collection('posts', ref => ref.where(path, '==', value))
      .valueChanges();
  }

  uploadImage(event, userId: string, postId: string) {
    // create a reference to the storage bucket location

    // the put method creates an AngularFireUploadTask
    // and kicks off the upload
    const path = `${postId}_${userId}`;
    const task = this.afStorage.ref(path).put(event.target.files[0]);
    const percentage = task.percentageChanges();
    const snapshot = task.snapshotChanges();
    const fileRef = this.afStorage.ref(path);
    return { percentage, snapshot, fileRef };
  }
}
