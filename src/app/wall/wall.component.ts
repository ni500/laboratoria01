import { Observable } from 'rxjs';
import { WallService } from './wall.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { User } from '../models/user';
import { Post } from '../models/post';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WallComponent implements OnInit {
  @Input() user: User;
  posts$: Observable<Post[] | unknown>;

  editionMode = false;
  indx = -1;
  filter: string;
  constructor(private wallService: WallService, private dialog: MatDialog) {}

  ngOnInit() {
    this.posts$ = this.wallService.getPosts();
  }

  deletePost(post: Post) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      data: { postId: post.id, postText: post.text }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.wallService.deletePost(result);
      } else {
        console.log('😅 Cancelado');
      }
    });
  }

  filterPosts(path: string, value: string) {
    // console.log(path);
    // console.log(value);
    this.posts$ = this.wallService.filterPosts(path, value);
  }
}
