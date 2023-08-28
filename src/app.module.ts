import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: parseInt(`${process.env.DATABASE_PORT}`),
      host: `${process.env.DATABASE_HOST}`,
      username: `${process.env.DATABASE_USERNAME}`,
      password: `${process.env.DATABASE_PASSWORD}`,
      database: `${process.env.DATABASE_NAME}`,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
