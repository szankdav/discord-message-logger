import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { messageController } from "./messageController.js";
import { insertMessage } from "../../model/message.js";
import { letterController } from "./letterController.js";
import { createTables } from "../../database/createTables.js";
import { execute, fetchAll } from "../../database/database.js";
import sqlite3 from "sqlite3";

let db;

vi.mock("../../model/message.js", () => ({
  insertMessage: vi.fn(),
}));

vi.mock("./letterController.js", () => ({
  letterController: vi.fn(),
}));

describe("messageController tests with test database", () => {
  let mockReq, mockRes;

  beforeEach(async () => {
    vi.clearAllMocks();

    db = new sqlite3.Database(":memory:");
    await createTables(db, execute);

    mockReq = {
      body: {
        author: "testAuthor",
        content: "testContent",
        messageCreatedAt: new Date(),
      },
    };

    mockRes = {
      status: vi.fn(() => mockRes),
      json: vi.fn(),
    };
  });

  afterEach(() => {
    db.close();
  });

  it("should successfully insert a message and process letters", async () => {
    await messageController(mockReq, mockRes);

    expect(insertMessage).toHaveBeenCalledWith([
      mockReq.body.author,
      mockReq.body.content,
      mockReq.body.messageCreatedAt,
    ]);

    expect(letterController).toHaveBeenCalledWith([
      mockReq.body.author,
      mockReq.body.content,
      mockReq.body.messageCreatedAt,
    ]);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith("Message added to the database!");
  });

  it("should log errors if `insertMessage` fails", async () => {
    const error = new Error("Insert message failed");
    insertMessage.mockRejectedValueOnce(error);
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await messageController(mockReq, mockRes);

    expect(insertMessage).toHaveBeenCalledWith([
      mockReq.body.author,
      mockReq.body.content,
      mockReq.body.messageCreatedAt,
    ]);

    expect(consoleSpy).toHaveBeenCalledWith(error);
    expect(letterController).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should log errors if `letterController` fails", async () => {
    const error = new Error("Letter controller failed");
    letterController.mockRejectedValueOnce(error);
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await messageController(mockReq, mockRes);

    expect(insertMessage).toHaveBeenCalledWith([
      mockReq.body.author,
      mockReq.body.content,
      mockReq.body.messageCreatedAt,
    ]);

    expect(letterController).toHaveBeenCalledWith([
      mockReq.body.author,
      mockReq.body.content,
      mockReq.body.messageCreatedAt,
    ]);

    expect(consoleSpy).toHaveBeenCalledWith(error);
    consoleSpy.mockRestore();
  });

  it("should not call `letterController` if `insertMessage` fails", async () => {
    const error = new Error("Insert message failed");
    insertMessage.mockRejectedValueOnce(error);  
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await messageController(mockReq, mockRes);
  
    expect(insertMessage).toHaveBeenCalledWith([
      mockReq.body.author,
      mockReq.body.content,
      mockReq.body.messageCreatedAt,
    ]);
  
    expect(letterController).not.toHaveBeenCalled();
  
    expect(consoleSpy).toHaveBeenCalledWith(error);
  
    consoleSpy.mockRestore();
  });

  it("should handle an empty `content` field without throwing errors", async () => {
    mockReq.body.content = "";

    await messageController(mockReq, mockRes);

    expect(insertMessage).toHaveBeenCalledWith([
      mockReq.body.author,
      mockReq.body.content,
      mockReq.body.messageCreatedAt,
    ]);

    expect(letterController).toHaveBeenCalledWith([
      mockReq.body.author,
      mockReq.body.content,
      mockReq.body.messageCreatedAt,
    ]);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith("Message added to the database!");
  });

  it("should not fail if `messageCreatedAt` is missing", async () => {
    delete mockReq.body.messageCreatedAt;

    await messageController(mockReq, mockRes);

    expect(insertMessage).toHaveBeenCalledWith([
      mockReq.body.author,
      mockReq.body.content,
      undefined,
    ]);

    expect(letterController).toHaveBeenCalledWith([
      mockReq.body.author,
      mockReq.body.content,
      undefined,
    ]);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith("Message added to the database!");
  });
});
