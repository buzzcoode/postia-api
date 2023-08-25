import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { ArticleService } from '@/article/article.service';
import { AuthGuard } from '@/user/guards/auth.guard';
import { User } from '@/user/decorators/user.decorator';
import { CreateArticleDto } from './dto/article.dto';
import { UserEntity } from '@/user/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';

@Controller('/api/v1/')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('articles')
  @UseGuards(AuthGuard)
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
}
