import {
  describe,
  it,
  vi,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";
import {
  sequelizeInstance,
  messageModel,
  alphabetModel,
} from "../../../vitest.config";
import { addMessageToDatabase, addLettersToDatabase } from "./api.controller";

describe("api.controller.js tests", () => {
  beforeAll(async () => {
    await sequelizeInstance.authenticate();
    messageModel.initialize(sequelizeInstance);
    alphabetModel.initialize(sequelizeInstance);
  });

  beforeEach(async () => {
    await sequelizeInstance.sync({ force: true });
  });

  afterAll(async () => {
    await sequelizeInstance.close();
  });

  describe("addMessageToDatabase tests", () => {
    it("should add a message to the database", async () => {
      const req = {
        body: {
          author: "Test Author",
          content: "Hello World",
          messageCreatedAt: new Date(),
        },
      };
      const res = {};
      const next = vi.fn();

      await addMessageToDatabase(req, res, next);

      const messages = await messageModel.getMessages();

      expect(messages.length).toBe(1);
      expect(messages[0].dataValues.author).toBe("Test Author");
      expect(next).toHaveBeenCalledOnce();
    });

    it("should handle an error when adding a message to the database", async () => {
      const req = { body: null };
      const res = {};
      const next = vi.fn();

      await addMessageToDatabase(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Error adding letter to database!" })
      );
    });

    describe("addLettersToDatabase tests", () => {
      it("should add letters from a message to the database", async () => {
        const req = {
          body: {
            author: "Test Author",
            content: "Hello World",
          },
        };
        const res = {};
        const next = vi.fn();

        await addLettersToDatabase(req, res, next);

        const letters = await alphabetModel.getLettersByAuthor("Test Author");

        expect(letters.length).toBeGreaterThan(0);
        const letterCounts = letters.map((l) => ({
          letter: l.dataValues.letter,
          count: l.dataValues.count,
        }));

        expect(letterCounts).toContainEqual({ letter: "h", count: 1 });
        expect(letterCounts).toContainEqual({ letter: "e", count: 1 });
        expect(letterCounts).toContainEqual({ letter: "l", count: 3 });
        expect(letterCounts).toContainEqual({ letter: "o", count: 2 });
        expect(next).toHaveBeenCalledOnce();
      });

      it("should increment existing letter counts in the database", async () => {
        await alphabetModel.createLetter({
          author: "Test Author",
          letter: "h",
          count: 1,
        });
        await alphabetModel.createLetter({
          author: "Test Author",
          letter: "e",
          count: 1,
        });

        const req = {
          body: {
            author: "Test Author",
            content: "Hello",
          },
        };
        const res = {};
        const next = vi.fn();

        await addLettersToDatabase(req, res, next);

        const letters = await alphabetModel.getLettersByAuthor("Test Author");

        const letterCounts = letters.map((l) => ({
          letter: l.dataValues.letter,
          count: l.dataValues.count,
        }));

        expect(letterCounts).toContainEqual({ letter: "h", count: 2 }); // Incremented
        expect(letterCounts).toContainEqual({ letter: "e", count: 2 }); // Incremented
        expect(letterCounts).toContainEqual({ letter: "l", count: 2 }); // Newly added
        expect(letterCounts).toContainEqual({ letter: "o", count: 1 }); // Newly added
        expect(next).toHaveBeenCalledOnce();
      });

      it("should handle an error when adding letters to the database", async () => {
        const req = { body: null };
        const res = {};
        const next = vi.fn();

        await addLettersToDatabase(req, res, next);

        expect(next).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Error adding letter to database!",
          })
        );
      });
    });
  });
});
