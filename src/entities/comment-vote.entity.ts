import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { Vote } from './vote.entity';

@Entity({
  name: 'comment_votes',
})
export class CommentVote {
  @PrimaryColumn('bigint', { name: 'comment_id' })
  @ManyToOne(() => Comment, (comment) => comment.commentVotes)
  @JoinColumn({ name: 'comment_id' })
  comment?: Comment;

  @PrimaryColumn('bigint', { name: 'vote_id' })
  @ManyToOne(() => Vote, (vote) => vote.commentVotes)
  @JoinColumn({ name: 'vote_id' })
  vote?: Vote;

  constructor(comment?: Comment, vote?: Vote) {
    this.comment = comment;
    this.vote = vote;
  }
}
