// Returns secure cookie options — secure:true only on HTTPS (not localhost)
export const secureOptions = (extraOptions?: object) => ({
  path: "/",
  secure: window.location.protocol === "https:",
  sameSite: "strict" as const,
  ...extraOptions,
});
