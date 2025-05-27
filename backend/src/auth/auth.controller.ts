import { Controller, Post, Body, UseGuards, Request, Put, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const updatedUser = await this.userService.updateProfile(req.user.id, updateProfileDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return {
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        color: updatedUser.color,
      },
    };
  }
} 