import { describe, it, vi, expect } from "vitest";
import { errorHandler } from "./error.controller";

describe("errorHandler middleware", () => {
  it("should return a custom error response", () => {
    const err = new Error("Custom error message");
    err.status = 400;

    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: "Custom error message",
    });
  });

  it("should return a default error response", () => {
    const err = new Error();
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: "Server error",
    });
  });
});
