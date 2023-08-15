import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsNumber()
  @IsNotEmpty()
  readonly document: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
