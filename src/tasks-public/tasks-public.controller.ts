import { Controller, Get, Query, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { ApiKeyAuthGuard } from 'src/auth/api-key-auth.guard';
import { GetTasksFilterDto } from 'src/tasks/dto/get-tasks-filter.dto';
import { Task } from 'src/tasks/task.entity';
import { TasksService } from 'src/tasks/tasks.service';

@Controller('tasks-public')
@UseGuards(ApiKeyAuthGuard)
export class TasksPublicController {
  constructor(private tasksService: TasksService) {}
  @Get('tasks')
  // @UseGuards(AuthGuard('jwt'))
  async getAllUsers(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto);
  }
}
