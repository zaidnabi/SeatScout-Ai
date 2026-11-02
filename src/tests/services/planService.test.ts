import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  uploadAndParsePlan,
  activatePlanService,
  rollbackPlanService,
  deletePlanService,
} from "@/server/services/planService";
import * as planQueries from "@/server/db/queries/plans";
import * as planFileQueries from "@/server/db/queries/planFiles";
import { BadRequestError, NotFoundError } from "@/server/utils/errors";
import { MAX_UPLOAD_SIZE_BYTES } from "@/lib/constants";

vi.mock("@/server/db/client", () => ({
  db: {
    transaction: vi.fn(async (cb) => {
      const mockTx = {
        insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue([]) }),
        update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([]) }) }) }),
        select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([]) }) }),
      };
      return await cb(mockTx);
    }),
  },
}));

vi.mock("@/server/db/queries/plans", () => ({
  getPlanById: vi.fn(),
  activatePlan: vi.fn(),
  rollbackPlan: vi.fn(),
  deletePlan: vi.fn(),
  listPlans: vi.fn(),
  createDraftPlan: vi.fn(),
}));

vi.mock("@/server/db/queries/planFiles", () => ({
  getPlanFile: vi.fn(),
  savePlanFile: vi.fn(),
}));

vi.mock("@/server/db/queries/audit", () => ({
  logAudit: vi.fn(),
}));

describe("Task 5, 7, 8: planService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("uploadAndParsePlan", () => {
    it("should throw BadRequestError if file exceeds size limit", async () => {
      const oversizedBuffer = Buffer.alloc(MAX_UPLOAD_SIZE_BYTES + 1024);
      await expect(
        uploadAndParsePlan(oversizedBuffer, "large.pdf", "application/pdf")
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError for non-PDF file type", async () => {
      const txtBuffer = Buffer.from("Not a pdf file content");
      await expect(
        uploadAndParsePlan(txtBuffer, "notes.txt", "text/plain")
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("activatePlanService", () => {
    it("should throw NotFoundError if plan does not exist", async () => {
      vi.mocked(planQueries.getPlanById).mockResolvedValueOnce(null);

      await expect(activatePlanService("non-existent-id")).rejects.toThrow(NotFoundError);
    });

    it("should activate valid plan inside transaction", async () => {
      const mockPlan = {
        id: "plan-123",
        title: "Exam Plan",
        examDate: "2026-07-01",
        session: "Evening",
        status: "draft",
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(planQueries.getPlanById).mockResolvedValueOnce(mockPlan as any);
      vi.mocked(planFileQueries.getPlanFile).mockResolvedValueOnce(null); // No file record -> bypasses parse check
      vi.mocked(planQueries.activatePlan).mockResolvedValueOnce({ ...mockPlan, status: "active" } as any);

      const result = await activatePlanService("plan-123");
      expect(result.status).toBe("active");
      expect(planQueries.activatePlan).toHaveBeenCalledWith("plan-123");
    });
  });

  describe("rollbackPlanService & deletePlanService", () => {
    it("should rollback archived plan to active", async () => {
      const mockPlan = {
        id: "plan-archived",
        examDate: "2026-07-01",
        session: "Evening",
        status: "archived",
      };
      vi.mocked(planQueries.getPlanById).mockResolvedValueOnce(mockPlan as any);
      vi.mocked(planQueries.rollbackPlan).mockResolvedValueOnce({ ...mockPlan, status: "active" } as any);

      const result = await rollbackPlanService("plan-archived");
      expect(result.status).toBe("active");
    });

    it("should delete existing plan", async () => {
      const mockPlan = { id: "plan-to-del", examDate: "2026-07-01", session: "Evening" };
      vi.mocked(planQueries.getPlanById).mockResolvedValueOnce(mockPlan as any);
      vi.mocked(planQueries.deletePlan).mockResolvedValueOnce(mockPlan as any);

      const result = await deletePlanService("plan-to-del");
      expect(result.success).toBe(true);
      expect(result.deletedPlanId).toBe("plan-to-del");
    });
  });
});
