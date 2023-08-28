import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Public } from 'src/decorators/public.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @Public()
    @ApiResponse({ status: 200, description: 'User logged successfully.'})
    @ApiResponse({ status: 200, description: 'Email & password not match!!'})
    @UseInterceptors(FileInterceptor('file', {}))
    async signIn(@Body() signInDto: SignInDto, @I18n() i18n: I18nContext) {
        const user = await this.authService.signIn(signInDto.email, signInDto.password);
        if (user) {
            return {
                'user': user,
                'message': i18n.t(`lang.auth.success`)
            }
        }
        return {
            'message': i18n.t(`lang.auth.failed`)
        }
    }

    @Get('logout')
    async logout(@Body() body) {
        console.log(body)
        return this.authService.logout(body.refreshToken);
    }
}
