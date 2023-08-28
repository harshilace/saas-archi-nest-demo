import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, isEmail } from 'class-validator';
export class SignInDto {
    @ApiProperty({ required: true, default: '' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ required: true, default: '' })
    @IsNotEmpty()
    readonly password: string;
}