import { ApiProperty } from '@nestjs/swagger';

export class Money {
    @ApiProperty()
    amount: number;
    @ApiProperty({ minLength: 3, maxLength: 3 })
    currency: string;
}