import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [HealthController],
  providers: [SupabaseService],
})
export class HealthModule {}
