import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsNumber()
  @IsNotEmpty()
  readonly document: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
