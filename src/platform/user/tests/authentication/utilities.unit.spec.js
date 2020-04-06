import {
  login,
  mfa,
  verify,
  logout,
  signup,
} from '../../authentication/utilities';

let oldSessionStorage;
let oldLocalStorage;
let oldWindow;

const fakeWindow = () => {
  oldSessionStorage = global.sessionStorage;
  oldLocalStorage = global.localStorage;
  oldWindow = global.window;
  global.sessionStorage = { setItem: () => {}, removeItem: () => {} };
  global.localStorage = { setItem: () => {}, removeItem: () => {} };
  global.window = {
    dataLayer: [],
    location: {
      get: () => global.window.location,
      set: value => {
        global.window.location = value;
      },
      pathname: '',
    },
  };
};

describe('authentication URL helpers', () => {
  beforeEach(fakeWindow);
  afterEach(() => {
    global.window = oldWindow;
    global.sessionStorage = oldSessionStorage;
    global.localStorage = oldLocalStorage;
  });

  test('should redirect for signup', () => {
    signup();
    expect(global.window.location).toEqual(
      expect.arrayContaining(['/sessions/signup/new']),
    );
  });

  test('should redirect for signup v1', () => {
    signup('v1');
    expect(global.window.location).toEqual(
      expect.arrayContaining(['/v1/sessions/signup/new']),
    );
  });

  test('should redirect for login', () => {
    login('idme');
    expect(global.window.location).toEqual(
      expect.arrayContaining(['/sessions/idme/new']),
    );
  });

  test('should redirect for login v1', () => {
    login('idme', 'v1');
    expect(global.window.location).toEqual(
      expect.arrayContaining(['/v1/sessions/idme/new']),
    );
  });

  test('should redirect for logout', () => {
    logout();
    expect(global.window.location).toEqual(
      expect.arrayContaining(['/sessions/slo/new']),
    );
  });

  test('should redirect for logout v1', () => {
    logout('v1');
    expect(global.window.location).toEqual(
      expect.arrayContaining(['/v1/sessions/slo/new']),
    );
  });

  test('should redirect for MFA', () => {
    mfa();
    expect(global.window.location).toEqual(
      expect.arrayContaining(['/sessions/mfa/new']),
    );
  });

  test('should redirect for MFA v1', () => {
    mfa('v1');
    expect(global.window.location).toEqual(
      expect.arrayContaining(['/v1/sessions/mfa/new']),
    );
  });

  test('should redirect for verify', () => {
    verify();
    expect(global.window.location).toEqual(
      expect.arrayContaining(['/sessions/verify/new']),
    );
  });

  test('should redirect for verify v1', () => {
    verify('v1');
    expect(global.window.location).toEqual(
      expect.arrayContaining(['/v1/sessions/verify/new']),
    );
  });
});
