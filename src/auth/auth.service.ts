import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { ApiKeyRepository } from './api-key.repository';
import { ApiKey } from './api-key.entity';
// import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    @InjectRepository(ApiKeyRepository)
    private apiKeyRepository: ApiKeyRepository,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async generateKeys(clientName: string): Promise<ApiKey> {
    const apiKey = await this.generateApiKey();
    const secretKey = await this.generateSecretKey();
    const newKey = this.apiKeyRepository.create({
      apiKey,
      secretKey,
      clientName,
    });
    return this.apiKeyRepository.save(newKey);
  }

  async generateApiKey(): Promise<string> {
    return randomBytes(16).toString('hex');
  }

  async generateSecretKey(): Promise<string> {
    return randomBytes(32).toString('hex');
  }

  async validateKeys(apiKey: string, secretKey: string): Promise<boolean> {
    const apiKeyEntity = await this.apiKeyRepository.findOne({
      where: { apiKey, secretKey },
    });
    return !!apiKeyEntity;
  }
}
