import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { AppHeaderComponent } from './app-header.component';

@Component({
  template: ''
})
class DummyRouteComponent {}

describe('AppHeaderComponent', () => {
  beforeEach(async () => {
    window.localStorage.setItem('hrflow.language', 'it');

    await TestBed.configureTestingModule({
      imports: [AppHeaderComponent],
      providers: [
        provideRouter([
          { path: '', component: DummyRouteComponent },
          { path: 'master-data', component: DummyRouteComponent },
          {
            path: 'admin',
            children: [
              { path: 'roles', component: DummyRouteComponent },
              { path: 'users', component: DummyRouteComponent },
              { path: 'users/:id', component: DummyRouteComponent },
              { path: 'permissions', component: DummyRouteComponent }
            ]
          }
        ]),
        {
          provide: AuthService,
          useValue: {
            logout: vi.fn()
          }
        }
      ]
    }).compileComponents();
  });

  afterEach(() => {
    window.localStorage.removeItem('hrflow.language');
    TestBed.resetTestingModule();
  });

  it('shows the master data title for the matching route', async () => {
    const fixture = TestBed.createComponent(AppHeaderComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/master-data');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Dati di base');
  });

  it('shows the permissions title for the role permission route', async () => {
    const fixture = TestBed.createComponent(AppHeaderComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/admin/permissions');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Permessi');
  });

  it('shows the roles title for the role administration route', async () => {
    const fixture = TestBed.createComponent(AppHeaderComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/admin/roles');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Ruoli');
  });

  it('shows the users title for the user administration list route', async () => {
    const fixture = TestBed.createComponent(AppHeaderComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/admin/users');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Utenti');
    expect(fixture.nativeElement.textContent).not.toContain('Home');
  });

  it('shows the users title for the user administration detail route', async () => {
    const fixture = TestBed.createComponent(AppHeaderComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/admin/users/user-1');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Utenti');
    expect(fixture.nativeElement.textContent).not.toContain('Home');
  });
});
