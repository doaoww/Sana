export {};

declare global {
  interface CustomJwtSessionClaims {
    unsafeMetadata: {
      role?: "market" | "user";
    };
    publicMetadata: {
      role?: "market" | "user";
    };
  }
}