import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Post } from '../models/post';
import { User } from '../models/user';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { WallService } from './wall.service';

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
    this.posts$ = this.wallService.filterPosts(path, value);
  }

  getAllPosts() {
    this.posts$ = this.wallService.getPosts();
  }
}
