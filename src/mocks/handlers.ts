import { rest } from "msw";

// Mock out all requests by default
export const defaultHandlers = [
  rest.get("*", (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
  rest.post("*", (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
  rest.patch("*", (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
  rest.put("*", (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
  rest.delete("*", (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
];
