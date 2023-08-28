import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
export class CreateUserDto {

    @ApiProperty({ required: true, default: '' })
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ required: true, default: '' })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ required: true, default: '' })
    @IsNotEmpty()
    readonly password: string;
}