import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';

import { CreateArticleDto } from './dto/article.dto';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '@/user/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { AppDataSource } from '@/index';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Find all articles
  async findAll(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = AppDataSource.getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    if (!currentUserId) {
      throw new HttpException('Articles not found', HttpStatus.NOT_FOUND);
    }

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.author,
        },
      });
      if (author) {
        queryBuilder.andWhere('articles.authorId = :id', {
          id: author.id,
        });
      }
    }

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }

  // Create a new article
  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }
    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser;

    return await this.articleRepository.save(article);
  }

  // Delete a article
  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.delete({ slug });
  }

  // Find Article entity by slug
  async findBySlug(slug: string): Promise<ArticleEntity> {
    return this.articleRepository.findOne({ where: { slug } });
  }

  // Update Article entity by slug
  async updateArticle(
    slug: string,
    updateArticleDto: CreateArticleDto,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    Object.assign(article, updateArticleDto);

    return await this.articleRepository.save(article);
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
