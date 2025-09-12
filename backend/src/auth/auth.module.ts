import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthMockService } from './auth-mock.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: AuthService,
      useClass: AuthMockService, // Usar servicio mock temporalmente
    },
    SupabaseService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
