import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, RegisterPayload, LoginPayload } from '.';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private user: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(payload: RegisterPayload): Promise<object> {
    const { email, password } = payload;
    const found = await this.user.findOne({ email });

    const selectedColor = Math.floor(Math.random() * 16) + 1;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    if (found) {
      throw new ConflictException('already-registered');
    }

    const user = await new this.user({
      ...payload,
      password: hashedPassword,
      avatarColor: selectedColor,
    }).save();

    const tokenPayload = { _id: user._id };
    const accessToken: string = this.jwtService.sign(tokenPayload);

    return {
      accessToken,
      message: 'Register successful.',
    };
  }

  async login(payload: LoginPayload): Promise<object> {
    const { email, password } = payload;

    const user = await this.user.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('not-yet-registered');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new UnauthorizedException('password-incorrect');
    }

    const tokenPayload = { _id: user._id };
    const accessToken: string = this.jwtService.sign(tokenPayload);

    return {
      accessToken,
      message: 'Login successful.',
    };
  }

  async getUser(_id: string): Promise<User> {
    return this.user.findById(_id, { password: 0 });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.user.find({}, { password: 0 });
  }
}
