import { PageInputDto } from './page-input.dto';

export class PageMetaDto {
  readonly page: number;
  readonly limit: number;

  // số item sau filter
  readonly itemCount: number;

  // tổng item toàn bộ bảng
  readonly itemTotalCount: number;

  readonly pageTotalCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor(
    pageInputDto: PageInputDto,
    itemCount: number,
    itemTotalCount: number,
  ) {
    this.page = pageInputDto.page!;
    this.limit = pageInputDto.limit!;

    this.itemCount = itemCount;
    this.itemTotalCount = itemTotalCount;

    this.pageTotalCount = Math.ceil(this.itemCount / this.limit);

    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageTotalCount;
  }
}