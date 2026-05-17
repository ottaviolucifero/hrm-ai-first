import { Route } from '@angular/router';

import { routes } from './app.routes';

describe('app routes', () => {
  it('registers device administration routes with device permissions', () => {
    const rootChildren = findChildren(routes, '');
    const adminChildren = findChildren(rootChildren, 'admin');
    const devicesRoute = findRoute(adminChildren, 'devices');
    const devicesCreateRoute = findRoute(adminChildren, 'devices/new');
    const devicesEditRoute = findRoute(adminChildren, 'devices/:id/edit');
    const devicesDetailRoute = findRoute(adminChildren, 'devices/:id');

    expect(devicesRoute?.data).toEqual({
      permissionModule: 'devices',
      requiredAction: 'view'
    });
    expect(devicesCreateRoute?.data).toEqual({
      permissionModule: 'devices',
      requiredAction: 'create'
    });
    expect(devicesEditRoute?.data).toEqual({
      permissionModule: 'devices',
      requiredAction: 'update'
    });
    expect(devicesDetailRoute?.data).toEqual({
      permissionModule: 'devices',
      requiredAction: 'view'
    });
  });

  it('registers holiday calendar routes with holiday calendar permissions', () => {
    const rootChildren = findChildren(routes, '');
    const adminChildren = findChildren(rootChildren, 'admin');
    const holidayCalendarsRoute = findRoute(adminChildren, 'holiday-calendars');
    const holidayCalendarsCreateRoute = findRoute(adminChildren, 'holiday-calendars/new');
    const holidayCalendarsEditRoute = findRoute(adminChildren, 'holiday-calendars/:id/edit');
    const holidayCalendarsDetailRoute = findRoute(adminChildren, 'holiday-calendars/:id');

    expect(holidayCalendarsRoute?.data).toEqual({
      permissionModule: 'holiday-calendars',
      requiredAction: 'view'
    });
    expect(holidayCalendarsCreateRoute?.data).toEqual({
      permissionModule: 'holiday-calendars',
      requiredAction: 'create'
    });
    expect(holidayCalendarsEditRoute?.data).toEqual({
      permissionModule: 'holiday-calendars',
      requiredAction: 'update'
    });
    expect(holidayCalendarsDetailRoute?.data).toEqual({
      permissionModule: 'holiday-calendars',
      requiredAction: 'view'
    });
  });

  it('registers leave request administration routes with leave request permissions', () => {
    const rootChildren = findChildren(routes, '');
    const adminChildren = findChildren(rootChildren, 'admin');
    const leaveRequestsRoute = findRoute(adminChildren, 'leave-requests');

    expect(leaveRequestsRoute?.data).toEqual({
      permissionModule: 'leave-requests',
      requiredAction: 'view'
    });
  });
});

function findChildren(routeList: readonly Route[], path: string): readonly Route[] {
  return routeList.find((route) => route.path === path)?.children ?? [];
}

function findRoute(routeList: readonly Route[], path: string): Route | undefined {
  return routeList.find((route) => route.path === path);
}
