import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyAdminPassword, hashPassword } from "@/server/auth/password";
import { signAdminToken, verifyAdminToken } from "@/server/auth/session";
import { requireAdmin } from "@/server/auth/requireAdmin";
import { POST as loginHandler } from "@/app/api/admin/login/route";
import { POST as logoutHandler } from "@/app/api/admin/logout/route";
import { NextRequest } from "next/server";
import { UnauthorizedError } from "@/server/utils/errors";
import { ADMIN_COOKIE_NAME } from "@/lib/constants";

describe("Task 3: Admin Auth Suite", () => {
  describe("password.ts", () => {
    it("should hash and verify passwords using bcrypt", async () => {
      const password = "adminSecretPassword123";
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();
      expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true);

      const isValid = await verifyAdminPassword("wrongPassword");
      expect(isValid).toBe(false);
    });
  });

  describe("session.ts", () => {
    it("should sign and verify valid admin JWT", async () => {
      const token = await signAdminToken({ adminUser: "superadmin" });
      expect(typeof token).toBe("string");

      const payload = await verifyAdminToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.sub).toBe("admin");
      expect(payload?.adminUser).toBe("superadmin");
    });

    it("should return null for malformed or tampered token", async () => {
      const result = await verifyAdminToken("invalid.token.structure");
      expect(result).toBeNull();
    });
  });

  describe("requireAdmin.ts", () => {
    it("should authorize request with valid cookie", async () => {
      const token = await signAdminToken();
      const request = new NextRequest("http://localhost:3000/api/admin/plans", {
        headers: {
          cookie: `${ADMIN_COOKIE_NAME}=${token}`,
        },
      });

      const auth = await requireAdmin(request);
      expect(auth.isAdmin).toBe(true);
      expect(auth.payload.sub).toBe("admin");
    });

    it("should authorize request with valid Authorization Bearer header", async () => {
      const token = await signAdminToken();
      const request = new NextRequest("http://localhost:3000/api/admin/plans", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const auth = await requireAdmin(request);
      expect(auth.isAdmin).toBe(true);
    });

    it("should throw UnauthorizedError when no credentials are provided", async () => {
      const request = new NextRequest("http://localhost:3000/api/admin/plans");
      await expect(requireAdmin(request)).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("POST /api/admin/login and POST /api/admin/logout", () => {
    it("should return 401 for wrong password", async () => {
      const request = new NextRequest("http://localhost:3000/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password: "incorrectPassword" }),
      });

      const response = await loginHandler(request);
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error.code).toBe("UNAUTHORIZED");
    });

    it("should clear cookie upon logout", async () => {
      const token = await signAdminToken();
      const request = new NextRequest("http://localhost:3000/api/admin/logout", {
        method: "POST",
        headers: {
          cookie: `${ADMIN_COOKIE_NAME}=${token}`,
        },
      });

      const response = await logoutHandler(request);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
    });
  });
});
