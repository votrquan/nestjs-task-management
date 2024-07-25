import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TasksPublicModule } from './tasks-public/tasks-public.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '45.76.176.239',
      port: 5432,
      username: 'vugia',
      password: 'manchester@307',
      database: 'task-management',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    TasksModule,
    TasksPublicModule,
  ],
})
export class AppModule {}
