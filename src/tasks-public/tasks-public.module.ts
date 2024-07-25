import { Module } from '@nestjs/common';
import { TasksPublicController } from './tasks-public.controller';
import { TasksService } from 'src/tasks/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
  controllers: [TasksPublicController],
  providers: [TasksService],
})
export class TasksPublicModule {}
