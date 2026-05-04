import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LoginResponse } from './auth.models';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  const loginResponse: LoginResponse = {
    accessToken: 'test-token',
    tokenType: 'Bearer',
    expiresIn: 3600,
    user: {
      id: 'user-id',
      tenantId: 'tenant-id',
      email: 'user@example.com',
      userType: 'TENANT_ADMIN'
    }
  };

  beforeEach(() => {
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    sessionStorage.clear();
  });

  it('stores access token after login', () => {
    authService.login('user@example.com', 'Secret1!').subscribe((response) => {
      expect(response).toEqual(loginResponse);
      expect(authService.getAccessToken()).toBe('test-token');
    });

    const request = httpTestingController.expectOne('/api/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      email: 'user@example.com',
      password: 'Secret1!'
    });
    request.flush(loginResponse);
  });

  it('loads authenticated user from me endpoint', () => {
    authService.me().subscribe((user) => {
      expect(user.email).toBe('user@example.com');
    });

    const request = httpTestingController.expectOne('/api/auth/me');
    expect(request.request.method).toBe('GET');
    request.flush(loginResponse.user);
  });

  it('removes token on logout', () => {
    sessionStorage.setItem('hrm.accessToken', 'test-token');

    authService.logout();

    expect(authService.getAccessToken()).toBeNull();
  });
});
