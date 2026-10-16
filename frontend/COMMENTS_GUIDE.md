# Frontend Comments Guide

This file explains the important comments in the frontend code so you can
quickly understand why each piece exists.

## core/services/auth.service.ts
- BehaviorSubject session state: keeps current user in memory and lets the
  navbar/guards update immediately on login or logout.
- Restore saved session on startup: reads token/user from localStorage so a
  page refresh does not log the user out.

## core/services/token.storage.ts
- Thin localStorage wrapper: keeps all browser storage logic in one place.

## core/guards/auth.guard.ts
- Block unauthenticated access: sends the user to `/login` and stops route activation.

## core/guards/guest.guard.ts
- Redirect logged-in users away from login/register so they cannot visit auth
  pages again.

## core/guards/role.guard.ts
- Reads required roles from route data and blocks non-matching users; currently
  kept generic for future agent-only routes.

## core/interceptors/auth.interceptor.ts
- Attach JWT: adds the `Bearer` token to every outgoing HTTP request.

## core/interceptors/error.interceptor.ts
- Central error handling: 401 clears the session and returns to login; other
  errors show the backend `message` in a snackbar.

## features/tickets/ticket-list/ticket-list.component.ts
- Status/priority reload: changing a filter resets to page 1.
- Debounce search: waits 400 ms and only calls the API once typing stops, using
  `debounceTime`, `distinctUntilChanged`, and `switchMap`.
- Created-by column shown only for agents.

## features/tickets/ticket-detail/ticket-detail.component.ts
- Forward-only transition map: only the next valid status is offered, matching
  the backend rule `open -> in-progress -> resolved -> closed`.
- Agent-only status control: hidden for regular users.
- Closed ticket commenting disabled: the form is removed when status is closed.

## shared/components/status-chip/status-chip.component.ts
- Shared colored badge for status and priority values so labels look consistent
  everywhere.

## src/rxjs-shim.d.ts
- Build-time shim used because the TypeScript toolchain could not resolve the
  bundled RxJS type declarations in this environment. Runtime imports still come
  from the installed `rxjs` package.
