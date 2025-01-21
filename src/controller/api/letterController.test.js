import { beforeEach, afterAll, vi, describe, it, expect, afterEach } from "vitest";
import { letterController } from "./letterController.js";
import {
  insertLetterAuthor,
  updateLetterCount,
  getLettersByAuthor,
} from "../../model/letter.js";
import { execute } from "../../database/database.js";
import { createTables } from "../../database/createTables.js";
import sqlite3 from "sqlite3";

let db;

beforeEach(async () => {
  db = new sqlite3.Database(":memory:");
  await createTables(db, execute);
});

afterEach(() => {
  db.close();
});

vi.mock("../../model/letter.js", () => ({
  insertLetterAuthor: vi.fn((params) => {
    return new Promise(async (resolve, reject) => {
      const sql = `INSERT INTO Letters (author, createdAt, updatedAt) VALUES (?, ?, ?)`;
      try {
        resolve(await execute(db, sql, params));
      } catch (error) {
        reject(error);
      }
    });
  }),
  updateLetterCount: vi.fn((letter, params) => {
    return new Promise(async (resolve, reject) => {
      const sql = `UPDATE Letters SET ${letter} = ${letter} + 1 WHERE author = ?`;
      try {
        resolve(await execute(db, sql, params));
      } catch (error) {
        reject(error);
      }
    });
  }),
  getLettersByAuthor: vi.fn((params) => {
    return new Promise(async (resolve, reject) => {
      const sql = `SELECT * FROM Letters WHERE author = ?`;
      try {
        resolve(await execute(db, sql, params));
      } catch (error) {
        reject(error);
      }
    });
  }),
}));

describe("letterController tests", () => {
  it("should insert a new author and update letter counts", async () => {
    const params = ["author1", "message", new Date()];

    await letterController(params);

    expect(insertLetterAuthor).toHaveBeenCalledWith([
      params[0],
      params[2],
      params[2],
    ]);

    expect(updateLetterCount).toHaveBeenCalledTimes(params[1].length);
  });

  it("should update letter counts for an existing author", async () => {
    const params = ["author1", "message", new Date()];

    getLettersByAuthor.mockResolvedValue({ author: "author1" });

    await letterController(params);

    expect(insertLetterAuthor).not.toHaveBeenCalled(); // Author should not be inserted
    expect(updateLetterCount).toHaveBeenCalledTimes(params[1].length); // Letters updated
  });

  // it("should skip invalid characters in the message", async () => {
  //   const params = ["author1", "me$$sage123!@", new Date()];

  //   await letterController(params);

  //   expect(insertLetterAuthor).toHaveBeenCalledWith([
  //     params[0],
  //     params[2],
  //     params[2],
  //   ]);

  //   // Only valid letters should be updated
  //   const validLetterCount = params[1]
  //     .toLowerCase()
  //     .split("")
  //     .filter((char) => /^[a-záéíóöőúüű]$/i.test(char)).length;

  //   expect(updateLetterCount).toHaveBeenCalledTimes(validLetterCount);
  // });

  // it("should handle empty messages without throwing errors", async () => {
  //   const params = ["author1", "", new Date()];

  //   await letterController(params);

  //   expect(insertLetterAuthor).toHaveBeenCalledWith([
  //     params[0],
  //     params[2],
  //     params[2],
  //   ]);

  //   expect(updateLetterCount).not.toHaveBeenCalled(); // No letters to update
  // });

  // it("should log errors if `getLettersByAuthor` fails", async () => {
  //   const params = ["author1", "message", new Date()];
  //   const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  //   // Simulate an error in `getLettersByAuthor`
  //   getLettersByAuthor.mockRejectedValueOnce(new Error("Database error"));

  //   await letterController(params);

  //   expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
  //   consoleSpy.mockRestore();
  // });

  // it("should log errors if `insertLetterAuthor` fails", async () => {
  //   const params = ["author1", "message", new Date()];
  //   const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  //   // Simulate an error in `insertLetterAuthor`
  //   insertLetterAuthor.mockRejectedValueOnce(new Error("Insert error"));

  //   await letterController(params);

  //   expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
  //   consoleSpy.mockRestore();
  // });

  // it("should log errors if `updateLetterCount` fails", async () => {
  //   const params = ["author1", "message", new Date()];
  //   const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  //   // Simulate an error in `updateLetterCount`
  //   updateLetterCount.mockRejectedValueOnce(new Error("Update error"));

  //   await letterController(params);

  //   expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
  //   consoleSpy.mockRestore();
  // });

  // it("should handle a single-character message", async () => {
  //   const params = ["author1", "A", new Date()];

  //   await letterController(params);

  //   expect(insertLetterAuthor).toHaveBeenCalledWith([
  //     params[0],
  //     params[2],
  //     params[2],
  //   ]);

  //   expect(updateLetterCount).toHaveBeenCalledTimes(1);
  // });
});
