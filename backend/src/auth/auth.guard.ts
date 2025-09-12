import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token de autorización requerido');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      // In a real app, you would verify the JWT token here
      // For now, we'll use a simple email-based lookup
      const email = this.decodeSimpleToken(token);
      
      const { data: user } = await this.supabaseService.client
        .from('users')
        .select('id, email, created_at, updated_at')
        .eq('email', email)
        .single();

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  private decodeSimpleToken(token: string): string {
    // Simple token format: base64(email)
    try {
      return Buffer.from(token, 'base64').toString('utf-8');
    } catch {
      throw new UnauthorizedException('Formato de token inválido');
    }
  }
}