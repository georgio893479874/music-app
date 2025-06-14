import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, emails, photos } = profile;

      if (!emails || emails.length === 0) {
        throw new Error('Email not found in Google profile');
      }

      const user = await this.userService.findByEmail(emails[0].value);

      if (!user) {
        const newUser = await this.userService.create({
          email: emails[0].value,
          firstname: name?.givenName || '',
          lastname: name?.familyName || '',
          avatar: photos?.[0]?.value || '',
        });
        return done(null, newUser);
      }

      return done(null, user);
    } catch (error) {
      console.error('Google OAuth validation error:', error);
      return done(error, false);
    }
  }
}
