import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async create(createCommentInput: CreateCommentInput) {
    const { userId, postId } = createCommentInput;

    let user: User | undefined, post: Post | undefined;
    if (userId) {
      user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found.');
      }
    }

    if (postId) {
      post = await this.postRepository.findOne({
        where: {
          id: postId,
        },
      });

      if (!post) {
        throw new NotFoundException('Post not found.');
      }
    }

    const comment = this.commentRepository.create({
      ...createCommentInput,
      user,
      post,
    });

    return this.commentRepository.save(comment);
  }

  findAll() {
    return this.commentRepository.find({
      relations: ['user', 'post', 'post.user']
    });
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOne({
      where:{
        id
      },
      relations: ['user', 'post', 'post.user']
    })

    if(!comment){
      throw new NotFoundException(`Comment with ID ${id} not found.`);
    }
    return comment;
  }

  async update(id: number, updateCommentInput: UpdateCommentInput) {
    const comment = await this.findOne(id);

    // Exclude id, postId, userId from direct assignment
    const { id: inputId, postId, userId, ...rest } = updateCommentInput;

    // Update basic fields (content, status) - excluding id to prevent entity confusion
    if (rest.content !== undefined) {
      comment.content = rest.content;
    }
    if (rest.status !== undefined) {
      comment.status = rest.status;
    }

    // Update post relation if provided
    if (postId) {
      const post = await this.postRepository.findOne({
        where: { id: postId },
      });
      if (post) {
        comment.post = post;
      }
    }

    // Update user relation if provided
    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (user) {
        comment.user = user;
      }
    }

    return this.commentRepository.save(comment);
  }

  async remove(id: number) {
    const comment = await this.findOne(id);
    const commentCopy = { ...comment };
    await this.commentRepository.remove(comment);
    return commentCopy;
  }
}
