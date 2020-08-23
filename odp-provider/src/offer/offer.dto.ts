import { ApiProperty } from '@nestjs/swagger';
import { Money } from 'src/common/money';

export class Offer {
  @ApiProperty()
  id: string;

  @ApiProperty()
  categoryPath: string;

  @ApiProperty()
  title?: string;

  @ApiProperty()
  field?: { [propertyName: string]: any };

  @ApiProperty()
  price?: Money;

  @ApiProperty()
  reputation: number;

  @ApiProperty({ isArray: true, type: 'string' })
  images: string[];

  @ApiProperty()
  description: string;
}

export class OfferPage {
  @ApiProperty({ type: Offer, isArray: true })
  content: Offer[];

  @ApiProperty({ type: 'integer' })
  total: number;
}
