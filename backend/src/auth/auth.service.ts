import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponse } from '../interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async register(registerDto: RegisterDto): Promise<UserResponse> {
    const { email, password } = registerDto;

    // Verificar si el usuario ya existe
    const { data: existingUser } = await this.supabaseService.client
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario en la base de datos
    const { data, error } = await this.supabaseService.client
      .from('users')
      .insert({
        email,
        password: hashedPassword,
      })
      .select('id, email, created_at, updated_at')
      .single();

    if (error) {
      console.error('Supabase error details:', error);
      console.error('Error code:', error.code);
      console.error('Error hint:', error.hint);
      throw new ConflictException(
        `Error al crear el usuario: ${error.message}`,
      );
    }

    // Generate a simple token (in production, use proper JWT)
    const token = Buffer.from(email).toString('base64');
    
    return {
      ...data,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<UserResponse> {
    const { email, password } = loginDto;

    // Buscar el usuario por email
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data: user, error } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
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

    // Generate a simple token (in production, use proper JWT)
    const token = Buffer.from(email).toString('base64');
    
    // Retornar usuario sin la contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-assignment
    const { password: _, ...userResponse } = user;
    return {
      ...userResponse,
      token,
    } as UserResponse;
  }
}
