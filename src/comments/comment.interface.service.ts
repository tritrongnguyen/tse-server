import { CommentDTO } from '../dtos/comment.dto';
import { CommentCURequest } from '../dtos/request/comment-cu-request';

export interface ICommentService {
  updateComment(request: CommentCURequest): Promise<CommentDTO>;
}
