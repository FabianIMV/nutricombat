import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponse } from '../interfaces/user.interface';

// Almacenamiento en memoria para pruebas
const mockUsers = new Map();

@Injectable()
export class AuthMockService {
  async register(registerDto: RegisterDto): Promise<UserResponse> {
    const { email, password } = registerDto;

    // Verificar si el usuario ya existe
    if (mockUsers.has(email)) {
      throw new ConflictException('El usuario ya existe');
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario en memoria
    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockUsers.set(email, user);

    // Retornar usuario sin la contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userResponse } = user;
    return userResponse as UserResponse;
  }

  async login(loginDto: LoginDto): Promise<UserResponse> {
    const { email, password } = loginDto;

    // Buscar el usuario por email
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = mockUsers.get(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(
      password,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      user.password as string,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Retornar usuario sin la contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-assignment
    const { password: _, ...userResponse } = user;
    return userResponse as UserResponse;
  }
}
