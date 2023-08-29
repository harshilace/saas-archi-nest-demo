import { BadRequestException, MiddlewareConsumer, Module, Scope } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { Connection, createConnection, getConnection } from 'typeorm';
import { REQUEST } from '@nestjs/core';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: TENANT_CONNECTION,
      inject: [
        REQUEST,
        Connection,
      ],
      scope: Scope.REQUEST,
      useFactory: async (request, connection) => {
        console.log('dsdsd');
        // const tenant: Tenant = await connection.getRepository(Tenant).findOne(({ where: { host: request.headers.host } }));
        const tenant: User = await connection.getRepository(User).findOne(({ where: { db_name: 'saas_archi_nest_user' } }));
        return getConnection(tenant.db_name);
      }
    }
  ],
  exports: [AuthService, TENANT_CONNECTION],
})
export class AuthModule {
  constructor(private readonly connection: Connection) { }

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(async (req, res, next) => {
        const tenant: User = await this.connection.getRepository(User).findOne(({ where: { db_name: 'saas_archi_nest_user' } }));
        console.log('tenant');
        console.log(tenant);
        if (!tenant) {
          throw new BadRequestException(
            'Database Connection Error',
            'There is a Error with the Database!',
          );
        }

        try {
          getConnection(tenant.db_name);
          next();
        } catch (e) {

          const createdConnection: Connection = await createConnection({
            name: tenant.db_name,
            type: "mysql",
            host: `localhost`,
            port: 3306,
            username: `harshil`,
            password: `H@R7S@qE23`,
            database: tenant.db_name,
            // entities: [ Book ],
            entities: ["dist/**/*.entity{.ts,.js}"],
            synchronize: true,
          })

          if (createdConnection) {
            console.log(["Connected To: ", createdConnection.name])
            next();
          } else {
            throw new BadRequestException(
              'Database Connection Error',
              'There is a Error with the Database!',
            );
          }
        }
      }).forRoutes('*');
  }
}
