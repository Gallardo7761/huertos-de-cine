import { AuthProvider as OidcProvider, useAuth as useOidcAuth } from "react-oidc-context";
import { createContext, useState } from "react";
import { useConfig } from "@/hooks/useConfig";
import { WebStorageStateStore } from "oidc-client-ts";
import { ADMIN_GROUP, OIDC_AUTHORITY, OIDC_CLIENT_ID } from "@/util/oidc";

export const AuthContext = createContext();

const oidcConfig = {
  authority: OIDC_AUTHORITY,
  client_id: OIDC_CLIENT_ID,
  redirect_uri: window.location.origin,
  response_type: "code",
  scope: "openid profile email groups",
  loadUserInfo: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, "/");
  }
};

export const AuthProvider = ({ children }) => {
  const { config, configLoading } = useConfig();

  if (configLoading || !config) return null;

  return (
    <OidcProvider {...oidcConfig}>
      <AuthBridge>{children}</AuthBridge>
    </OidcProvider>
  );
};

const AuthBridge = ({ children }) => {
  const oidc = useOidcAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const authStatus = (oidc.isLoading || oidc.activeNavigator || isLoggingOut)
    ? "checking" 
    : oidc.isAuthenticated ? "authenticated" : "unauthenticated";

  const user = oidc.user ? {
    sub: oidc.user.profile.sub,
    name: oidc.user.profile.name || "Usuario",
    preferred_username: oidc.user.profile.preferred_username || oidc.user.profile.sub?.substring(0, 8),
    email: oidc.user.profile.email,
    groups: oidc.user.profile.groups || [],
    role: oidc.user.profile.groups?.includes(ADMIN_GROUP) ? "ADMIN" : "USER"
  } : null;

  const login = () => oidc.signinRedirect();
  const logout = () => {
    setIsLoggingOut(true);
    oidc.signoutRedirect({ post_logout_redirect_uri: window.location.origin });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: oidc.user?.access_token,
        authStatus,
        login,
        logout,
        error: oidc.error?.message,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};