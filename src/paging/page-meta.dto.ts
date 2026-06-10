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
    this.page = pageInputDto.page || 1;
    this.limit = pageInputDto.limit || itemCount;

    this.itemCount = itemCount;

    this.pageTotalCount = Math.ceil(this.itemCount / this.limit);
  }
}