import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private supabaseService: SupabaseService) {}

  async getProfile(userId: string) {
    const { data: profile, error } = await this.supabaseService.client
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw new Error(`Error fetching profile: ${error.message}`);
    }

    return { profile: profile || null };
  }

  async createProfile(userId: string, createProfileDto: CreateProfileDto) {
    // Check if profile already exists
    const existingProfile = await this.getProfile(userId);
    if (existingProfile.profile) {
      return await this.updateProfile(userId, createProfileDto);
    }

    const { data: profile, error } = await this.supabaseService.client
      .from('profiles')
      .insert({
        user_id: userId,
        ...createProfileDto,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating profile: ${error.message}`);
    }

    return { profile, message: 'Perfil creado exitosamente' };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const { data: profile, error } = await this.supabaseService.client
      .from('profiles')
      .update(updateProfileDto)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating profile: ${error.message}`);
    }

    if (!profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    return { profile, message: 'Perfil actualizado exitosamente' };
  }
}