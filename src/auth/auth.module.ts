import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { ApiKey } from './api-key.entity';
import { ApiKeyRepository } from './api-key.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([User, ApiKey]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: UsersRepository,
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(User).extend(UsersRepository),
      inject: [DataSource],
    },
    {
      provide: ApiKeyRepository,
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(User).extend(ApiKeyRepository),
      inject: [DataSource],
    },
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
