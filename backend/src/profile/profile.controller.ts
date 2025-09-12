import { Controller, Get, Post, Put, Body, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import type { UserResponse } from '../interfaces/user.interface';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async getProfile(@GetUser() user: UserResponse) {
    return await this.profileService.getProfile(user.id);
  }

  @Post()
  async createProfile(
    @GetUser() user: UserResponse,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return await this.profileService.createProfile(user.id, createProfileDto);
  }

  @Put()
  async updateProfile(
    @GetUser() user: UserResponse,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.profileService.updateProfile(user.id, updateProfileDto);
  }
}