import { jwtDecode } from "jwt-decode";
import {
  Log,
  User,
  UserManager,
  type UserManagerSettings,
  WebStorageStateStore,
} from "oidc-client-ts";

const oidcSettings: UserManagerSettings = {
  // TODO: replace with your actual issuer/authority URL
  authority: 'https://auth.letsbuild.com',

  // TODO: paste the Client ID from your OAuth provider here
  client_id: "75eb7f7d-73fa-4968-be7f-844071e4898e",

  // Must match the redirect URI you configured: http://localhost:5173/auth-callback
  redirect_uri: `${window.location.origin}/auth-callback`,

  // Where to send the user after logout
  post_logout_redirect_uri: `${window.location.origin}`,

  // Using authorization code with PKCE (recommended for SPAs)
  response_type: "code",

  // Match the scopes from your OAuth app configuration
  scope: "openid offline_access profile projects",

  // Store state/user in localStorage so it survives reloads
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

Log.setLogger(console);
Log.setLevel(Log.INFO);

export const userManager = new UserManager(oidcSettings);

export function login() {
  return userManager.signinRedirect();
}

export function logout() {
  return userManager.signoutRedirect();
}

export function refresh() {
  return userManager.signinSilent();
}

export async function getPayload(): Promise<User | null> {
  return userManager.getUser();
}

interface Payload {
  email: string;
}

export async function getUserEmail(): Promise<string | null> {
  const payload = await getPayload();
  if (!payload?.access_token) {
    return null;
  }
  const decoded = jwtDecode<Payload>(payload?.access_token);
  return decoded.email;
}

export async function handleAuthCallback() {
  await userManager.signinRedirectCallback();
  // After successfully processing the callback, send the user to the app root
  window.location.replace("/");
}
