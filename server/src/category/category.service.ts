import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { join } from 'path';
import { FileUpload } from 'graphql-upload';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { Post } from 'src/post/entities/post.entity';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async create(createCategoryInput: CreateCategoryInput) {
    const { name } = createCategoryInput;
    const slug = slugify(name, { lower: true });

    const newCategory = this.categoryRepository.create({
      ...createCategoryInput,
      slug,
    });
    return await this.categoryRepository.save(newCategory);
  }

  async findAll() {
    const categories = await this.categoryRepository.find({
      order:{
        createdAt: "DESC"
      }
    });

    return categories;
  }

  findOne(id: number) {
    return this.categoryRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateCategoryInput: UpdateCategoryInput,
  ) {
    const category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    await this.categoryRepository.update(id, updateCategoryInput);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<ResponseDto> {
    const category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    const hasPosts = await this.postRepository.count({
      where:{
        category: {
          id
        }
      }
    })

    if(hasPosts > 0){
      return {
        status: false,
        message: 'Category cannot be deleted because it has associated posts. Please delete the posts first.',
      }
    }

    await this.categoryRepository.delete(id);

    return {
      status:true,
      message: "Category removed successfully."
    };
  }

  private async saveImage(image: FileUpload): Promise<string> {
    const { createReadStream, filename } = image;
    const uniqueFilename = `${uuidv4()}-${filename}`;
    const imagePath = join(__dirname, '../../uploads', uniqueFilename);

    return new Promise((resolve, reject) => {
      const stream = createReadStream();
      const writeStream = require('fs').createWriteStream(imagePath);

      stream
        .pipe(writeStream)
        .on('finish', () => resolve(uniqueFilename))
        .on('error', (error: Error) => {
          console.error('Error saving image:', error);
          reject(error);
        });
    });
  }
}
