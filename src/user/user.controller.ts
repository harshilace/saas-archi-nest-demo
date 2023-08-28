import { BadRequestException, Body, Controller, Get, HttpException, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/createUserDto.dto';
import { Public } from 'src/decorators/public.decorator';
import * as bcrypt from 'bcrypt';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
    constructor(private userService: UserService) { }
    
    @Get('/list')
    @ApiResponse({ status: 200, description: 'User list getting successfully.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    async getUsers(@I18n() i18n: I18nContext) {
        const users = await this.userService.getUsers();
        return {
            'users' : users,
            'message' : i18n.t(`lang.user.list`)
        };
    }

    @Get(':userID')
    @ApiResponse({ status: 200, description: 'Data get successfully.'})
    @ApiResponse({ status: 403, description: 'User does not exist!.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    async getUser(@Param('userID', ParseIntPipe) userID: Number, @I18n() i18n: I18nContext) {
        const user = await this.userService.getUser(userID);
        if (user) {
            return {
                'user' : user,
                'message' : i18n.t(`lang.data_success`)
            };
        }
        throw new HttpException(i18n.t(`lang.user.not_found`), 404);
    }

    @Post('')
    @Public()
    @ApiResponse({ status: 201, description: 'User stored successfully.'})
    @ApiResponse({ status: 400, description: 'Bad Request'})
    async registerUser(@Body() createUserDto: CreateUserDto, @I18n() i18n: I18nContext) {
        const exitUser = await this.userService.findOne(createUserDto.email);
        if (exitUser) {
            throw new BadRequestException('email already exist.');
        }
        let fields = {
            "name": <String>createUserDto.name,
            "email": <String>createUserDto.email,
            "password": <String> await bcrypt.hash(createUserDto.password, 10),
        };
        const user = await this.userService.addUser(fields);
        return {
            'user' : user,
            'message' : i18n.t(`lang.user.store`)
        };
    }
}
