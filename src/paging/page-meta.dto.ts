import { PageInputDto } from './page-input.dto';

export class PageMetaDto {
  readonly page: number;
  readonly limit: number;

  readonly itemCount: number;
  readonly pageTotalCount: number;

  constructor(
    pageInputDto: PageInputDto,
    itemCount: number,
  ) {
    this.page = pageInputDto.page!;
    this.limit = pageInputDto.limit!;

    this.itemCount = itemCount;

    this.pageTotalCount = Math.ceil(this.itemCount / this.limit);
  }
}