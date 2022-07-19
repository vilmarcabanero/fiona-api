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
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private user: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(payload: RegisterPayload): Promise<object> {
    const { email, password } = payload;
    const [username] = email.split('@');
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
      username,
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
    const [username] = email.split('@');

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

    await this.user.findByIdAndUpdate(user._id, { username });

    return {
      accessToken,
      message: 'Login successful.',
    };
  }

  async getUser(_id: string): Promise<User> {
    const user = await this.user.findById(_id, { password: 0 });

    const [username] = user.email.split('@');

    await this.user.findByIdAndUpdate(_id, { username });
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.user.find({}, { password: 0 });
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.user.findOne({ username }, { password: 0 });
  }

  async updateProfilePicture(payload: any, user: any): Promise<User> {
    const { profilePictureUrl } = payload;
    await this.user.findByIdAndUpdate(user._id, { profilePictureUrl });

    return this.user.findById(user._id, { password: 0 });
  }
}
