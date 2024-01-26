import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(
        @Body() authDto: AuthDto
    ) {
        return this.authService.signup(authDto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signin(@Body() authDto: AuthDto) {
        return this.authService.signin(authDto)
    }
}