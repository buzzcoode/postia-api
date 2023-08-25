import { Controller, Get } from '@nestjs/common';

import { TagService } from '@/tag/tag.service';

@Controller('/api/v1/')
export class TagController {
  constructor(private readonly tagsService: TagService) {}

  @Get('tags')
  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagsService.findAll();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
