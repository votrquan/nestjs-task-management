// api-key-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private apiKeyService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const secretKey = request.headers['x-secret-key'];

    if (!apiKey || !secretKey) {
      throw new UnauthorizedException('API key and secret key are required');
    }

    const isValid = await this.apiKeyService.validateKeys(apiKey, secretKey);
    if (!isValid) {
      throw new UnauthorizedException('Invalid API key or secret key');
    }

    return true;
  }
}
