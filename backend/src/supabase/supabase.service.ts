import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient<any, 'users'>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = configService.get<string>('SUPABASE_URL')!;
    const supabaseKey = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!;

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      db: { schema: 'users' },
    }) as SupabaseClient<any, 'users'>;
  }

  get client(): SupabaseClient<any, 'users'> {
    return this.supabase;
  }
}
