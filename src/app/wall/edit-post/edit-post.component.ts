import { User } from './../../models/user';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { Post } from 'src/app/models/post';
import { WallService } from '../wall.service';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPostComponent implements OnInit {
  @Input() user: User;
  @Input() post: Post;

  newPostForm: FormGroup;
  privacyOptions = [
    { name: 'Público', value: 'public' },
    { name: 'Amigos', value: 'friends' }
  ];
  isNewPost = true;
  imgUrl: string;
  uploadProgress: Observable<number>;

  newPost: Post;
  constructor(
    private formBuilder: FormBuilder,
    private wallService: WallService
  ) {}

  ngOnInit() {
    this.newPost = {
      id: this.post ? this.post.id : new Date().getTime().toString(),
      text: this.post ? this.post.text : '',
      privacy: this.post ? this.post.privacy : '',
      userUid: this.user ? this.user.uid : '',
      imgUrl: this.post ? this.post.imgUrl || '' : ''
    };
    this.newPostForm = this.formBuilder.group({
      text: new FormControl(
        this.post ? this.post.text : '',
        Validators.required
      ),
      privacy: new FormControl()
    });
    if (this.post) {
      this.newPostForm.patchValue({ privacy: this.post.privacy });
      this.isNewPost = false;
    } else {
      this.newPostForm.patchValue({ privacy: this.privacyOptions[0].value });
    }
  }
  publish() {
    if (this.newPostForm.valid) {
      console.log('🎉 IS VALID');
      this.newPost = {
        ...this.newPost,
        text: this.newPostForm.value.text,
        privacy: this.newPostForm.value.privacy,
        imgUrl: this.imgUrl || ''
      };
      this.wallService.addPost(this.newPost);
      this.newPost = {
        id: new Date().getTime().toString(),
        text: '',
        privacy: 'public',
        userUid: this.user ? this.user.uid : '',
        imgUrl: ''
      };
      this.newPostForm.patchValue({ privacy: this.newPost.privacy });
      this.newPostForm.patchValue({ text: this.newPost.text });
    } else {
      console.log('😪 Te falta algo.');
    }
  }

  edit() {
    this.wallService.editPost({
      ...this.newPost,
      text: this.newPostForm.value.text,
      privacy: this.newPostForm.value.privacy,
      imgUrl: this.imgUrl || ''
    });
  }

  uploadImage(event) {
    const imgRef = this.wallService.uploadImage(
      event,
      this.newPost.userUid,
      this.newPost.id
    );
    this.uploadProgress = imgRef.percentage;
    imgRef.snapshot
      .pipe(
        finalize(() => {
          imgRef.fileRef
            .getDownloadURL()
            .subscribe((url: any) => (this.imgUrl = url));
        })
      )
      .subscribe();
  }
}
