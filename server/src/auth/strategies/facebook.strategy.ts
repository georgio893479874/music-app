import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get('FACEBOOK_CLIENT_SECRET'),
      callbackURL: configService.get('FACEBOOK_CALLBACK_URL'),
      profileFields: ['id', 'emails', 'name', 'photos'],
      scope: ['email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, name, photos } = profile;
    const email = emails && emails[0]?.value;

    if (!email) {
      return done(new Error('No email found in Facebook profile'), null);
    }

    let user = await this.userService.findByEmail(email);

    if (!user) {
      user = await this.userService.create({
        email,
        firstname: name?.givenName,
        lastname: name?.familyName,
        avatar: photos && photos[0]?.value,
        password: null,
      });
    }

    done(null, user);
  }
}
