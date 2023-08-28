import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>, private jwtService: JwtService) {}

    async signIn(email: string, password: string): Promise<any> {
      const user = await this.userRepository.findOne({where: {email: email}});
      if (user && await bcrypt.compare(password, user.password)) {
        const payload = { sub: user.user_id, username: user.name };
        const { password, deleted_at, ...result } = user;
        return {
          ...result,
          access_token: await this.jwtService.signAsync(payload),
        };
      }
      return null;
    }

    async logout(refreshStr): Promise<void> {
      // const refreshToken = await this.retrieveRefreshToken(refreshStr);
  
      // if (!refreshToken) {
      //   return;
      // }
      // // delete refreshtoken from db
      // this.refreshTokens = this.refreshTokens.filter(
      //   (refreshToken) => refreshToken.id !== refreshToken.id,
      // );
    }
}
