import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { FileUpload } from 'graphql-upload';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import slugify from 'slugify';
import { join } from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Tag } from 'src/tag/entities/tag.entity';
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createPostInput: CreatePostInput) {
    const { name, categoryId, authorId, tagIds, ...postData } = createPostInput;
    const slug = slugify(name, { lower: true });

    const user = await this.userRepository.findOne({
      where: {
        id: authorId,
      },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    let category: Category = null;

    if (categoryId) {
      category = await this.categoryRepository.findOne({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        throw new Error('Category not found.');
      }
    }

    const tags = tagIds
      ? await this.tagRepository.findBy({
          id: In(tagIds),
        })
      : [];

    const post = this.postRepository.create({
      ...postData,
      name,
      slug,
      category,
      user,
      tags,
    });
    return this.postRepository.save(post);
  }

  private async saveImage(image: FileUpload): Promise<string> {
    const filename = `${uuidv4()}-${image.filename}`;
    const imagePath = join(__dirname, '../../uploads', filename);

    await fs.writeFile(imagePath, await image.createReadStream());

    return filename;
  }

  findAll() {
    return this.postRepository.find({
      relations: ['category', 'user', 'tags'],
    });
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
      relations: ['category', 'user', 'tags'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }
    return post;
  }

  async update(id: number, updatePostInput: UpdatePostInput) {
    const post = await this.findOne(id);

    const { id: inputId, categoryId, tagIds, authorId, ...entityFields } = updatePostInput;

    // Update basic fields (don't touch slug - keep it stable)
    if (entityFields.name !== undefined) post.name = entityFields.name;
    if (entityFields.summary !== undefined) post.summary = entityFields.summary;
    if (entityFields.description !== undefined) post.description = entityFields.description;
    if (entityFields.image !== undefined) post.image = entityFields.image;
    if (entityFields.status !== undefined) post.status = entityFields.status;

    // Update category
    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (category) post.category = category;
    }

    // Update tags
    if (tagIds) {
      post.tags = await this.tagRepository.findBy({ id: In(tagIds) });
    }

    return this.postRepository.save(post);
  }

  async remove(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['category', 'user', 'tags', 'comments'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found.`);
    }

    const postCopy = { ...post };

    // Delete all comments associated with this post first
    if (post.comments && post.comments.length > 0) {
      await this.postRepository.manager.remove(post.comments);
    }

    await this.postRepository.remove(post);
    return postCopy;
  }
}
