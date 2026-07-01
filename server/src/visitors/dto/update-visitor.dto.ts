import { IsEmail, IsObject, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';

export class UpdateVisitorDto {
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== '')
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string | null;

  @IsOptional()
  @IsObject()
  attributes?: Record<string, unknown>;
}
