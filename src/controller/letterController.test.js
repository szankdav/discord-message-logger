import { beforeEach, vi, describe, it, expect, afterEach } from "vitest";
import { letterController } from "./letterController.js";
import {
  insertLetters,
  updateLetterCount,
  getFirstAuthorByAuthor,
} from "../model/letter.js";
import { execute } from "../database/database.js";
import { createTables } from "../database/createTables.js";
import sqlite3 from "sqlite3";

let db;

vi.mock("../model/letter.js", () => ({
  insertLetters: vi.fn(),
  updateLetterCount: vi.fn(),
  getFirstAuthorByAuthor: vi.fn(),
}));

describe("letterController tests", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    db = new sqlite3.Database(":memory:");
    await createTables(db, execute);
  });
  
  afterEach(() => {
    db.close();
  });

  it("should insert a new author and update letter counts", async () => {
    const params = ["author1", "message", new Date()];

    await letterController(params);

    expect(insertLetters).toHaveBeenCalledWith([
      params[0],
      '',
      0,
      params[2],
      params[2],
    ]);

    expect(updateLetterCount).toHaveBeenCalledTimes(params[1].length);
  });

    it("should skip invalid characters in the message", async () => {
    const params = ["author1", "me$$sage123!@", new Date()];

    await letterController(params);

    expect(insertLetters).toHaveBeenCalledWith([
      params[0],
      '',
      0,
      params[2],
      params[2],
    ]);

    const validLetterCount = params[1]
      .toLowerCase()
      .split("")
      .filter((char) => /^[a-záéíóöőúüű]$/i.test(char)).length;

    expect(updateLetterCount).toHaveBeenCalledTimes(validLetterCount);
  });

  it("should update letter counts for an existing author", async () => {
    const params = ["author1", "message", new Date()];
  
    getFirstAuthorByAuthor.mockResolvedValue({ author: "author1" });

    await letterController(params);

    expect(insertLetters).not.toHaveBeenCalled(); 
    expect(updateLetterCount).toHaveBeenCalledTimes(params[1].length);
    getFirstAuthorByAuthor.mockRestore();
  });

  it("should handle empty messages without throwing errors", async () => {
    const params = ["author1", "", new Date()];

    await letterController(params);

    expect(insertLetters).toHaveBeenCalledWith([
      params[0],
      '',
      0,
      params[2],
      params[2],
    ]);

    expect(updateLetterCount).not.toHaveBeenCalled();
  });

  it("should log errors if `getFirstAuthorByAuthor` fails", async () => {
    const params = ["author1", "message", new Date()];
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    getFirstAuthorByAuthor.mockRejectedValueOnce(new Error("Database error"));

    await letterController(params);

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    consoleSpy.mockRestore();
    getFirstAuthorByAuthor.mockRestore();
  });

  it("should log errors if `insertLetters` fails", async () => {
    const params = ["author1", "message", new Date()];
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    insertLetters.mockRejectedValueOnce(new Error("Insert error"));

    await letterController(params);

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("should log errors if `updateLetterCount` fails", async () => {
    const params = ["author1", "message", new Date()];
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    updateLetterCount.mockRejectedValueOnce(new Error("Update error"));

    await letterController(params);

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("should handle a single-character message", async () => {
    const params = ["author1", "A", new Date()];

    await letterController(params);

    expect(insertLetters).toHaveBeenCalledWith([
      params[0],
      '',
      0,
      params[2],
      params[2],
    ]);

    expect(updateLetterCount).toHaveBeenCalledTimes(1);
  });
});
