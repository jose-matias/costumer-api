import { BadGatewayException, HttpCode, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpModuleOptions, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly baseURL: string;
  private readonly realm: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseURL = this.configService.getOrThrow<string>('KEYCLOAK_BASE_URL');
    this.realm = this.configService.getOrThrow<string>('KEYCLOAK_REALM');
  }

  async authenticate(accessToken: string): Promise<boolean> {
    const url = `${this.baseURL}/auth/realms/${this.realm}/protocol/openid-connect/userinfo`;

    const httpOptions: HttpModuleOptions = {
      headers: {
        Authorization: accessToken,
      },
    };

    const { status } = await firstValueFrom(
      this.httpService.get(url, httpOptions).pipe(
        catchError((error: AxiosError) => {
          if (error.response.status === HttpStatus.UNAUTHORIZED) {
            throw new UnauthorizedException();
          }

          throw new BadGatewayException();
        }),
      ),
    );

    return status === HttpStatus.OK;
  }
}
