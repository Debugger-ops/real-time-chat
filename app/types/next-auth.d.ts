// Type definitions for next-auth session and user.
declare module "next-auth" {
    interface Session {
        user?: {
            id?: string;
            email?: string;
            name?: string;
        };
    }
 }
 