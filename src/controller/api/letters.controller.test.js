import { describe, it, vi, expect, beforeEach, afterAll } from "vitest";
import { sequelizeInstance, alphabetModel } from "../../../vitest.config";
import { getLetters } from "./letters.controller";

describe("getLetters API handler", () => {
  beforeEach(async () => {
    await sequelizeInstance.authenticate();
    alphabetModel.initialize(sequelizeInstance);
    await sequelizeInstance.sync({ force: true });
  });

  afterAll(async () => {
    await sequelizeInstance.close();
  });

  it("should fetch letters from the database", async () => {
    const req = {};
    const res = {
      json: vi.fn(),
    };

    // Prepopulate the database
    await alphabetModel.createLetter({ author: "Author1", letter: "a", count: 3 });
    await alphabetModel.createLetter({ author: "Author2", letter: "b", count: 2 });

    await getLetters(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ letter: "a", count: 3 }),
        expect.objectContaining({ letter: "b", count: 2 }),
      ])
    );
  });

//   it("should handle errors gracefully", async () => {
//     const req = {};
//     const res = {
//       json: vi.fn(),
//       status: vi.fn().mockReturnThis(),
//     };

//     const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  
//     vi.spyOn(alphabetModel, "getLetters").mockRejectedValue(new Error("Database error"));
  
//     await getLetters(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
  
//     expect(res.json).toHaveBeenCalledWith({
//       error: true,
//       message: "Failed to fetch letters",
//     });
  
//     expect(consoleLogSpy).toHaveBeenCalledWith("Error fetching letters: ", expect.any(Error));
  
//     consoleLogSpy.mockRestore();
//   });
});