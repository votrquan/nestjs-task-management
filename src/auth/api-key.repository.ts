// api-key.repository.ts
import { Repository } from 'typeorm';
import { ApiKey } from './api-key.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeyRepository extends Repository<ApiKey> {}
