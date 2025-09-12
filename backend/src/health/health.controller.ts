import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('health')
export class HealthController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'nutricombat-backend',
    };
  }

  @Get('supabase')
  async checkSupabaseConnection() {
    try {
      // Intentar hacer una consulta simple a Supabase
      const { error } = await this.supabaseService.client
        .from('users')
        .select('count', { count: 'exact', head: true });

      if (error) {
        return {
          status: 'ERROR',
          message: 'Failed to connect to Supabase',
          error: error.message,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        status: 'OK',
        message: 'Successfully connected to Supabase',
        timestamp: new Date().toISOString(),
        tableExists: true,
      };
    } catch (error: any) {
      return {
        status: 'ERROR',
        message: 'Failed to connect to Supabase',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error: error.message as string,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
