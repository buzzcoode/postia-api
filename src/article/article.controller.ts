import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';

import { ArticleService } from '@/article/article.service';
import { AuthGuard } from '@/user/guards/auth.guard';
import { User } from '@/user/decorators/user.decorator';
import { CreateArticleDto } from './dto/article.dto';
import { UserEntity } from '@/user/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';

@Controller('/api/v1/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // Get all articles
  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAll(currentUserId, query);
  }

  // Create Article
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );

    return this.articleService.buildArticleResponse(article);
  }

  // Get Single Article by Slug
  @Get(':slug')
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(slug);

    return this.articleService.buildArticleResponse(article);
  }

  // Delete Single Article
  @Delete(':slug')
  async deleteArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    return this.articleService.deleteArticle(slug, currentUserId);
  }

  // Update Single Article
  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: CreateArticleDto,
  ) {
    const article = await this.articleService.updateArticle(
      slug,
      updateArticleDto,
      currentUserId,
    );

    return this.articleService.buildArticleResponse(article);
  }
}
