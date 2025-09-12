import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponse } from '../interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<{
    message: string;
    user: UserResponse;
  }> {
    const user = await this.authService.register(registerDto);
    return {
      message: 'Usuario registrado exitosamente',
      user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{
    message: string;
    user: UserResponse;
  }> {
    const user = await this.authService.login(loginDto);
    return {
      message: 'Inicio de sesión exitoso',
      user,
    };
  }
}
