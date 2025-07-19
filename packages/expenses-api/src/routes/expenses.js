import { Router } from "express";
import asyncHandler from "express-async-handler";
import z from "zod";
import * as db from "../db/memory.js";

const router = Router();

const CreateExpenseSchema = z.object({
    id: z.int32().optional(),
    status: z.union([z.literal("approved"), z.literal("pending")]).optional(),
    line_items: z.array(
        z.object({
            description: z.string(),
            amount: z.number().min(0),
        }),
    ),
});

router.post(
    "/",
    asyncHandler(async (req, res) => {
        const expense = CreateExpenseSchema.parse(req.body);
        db.insert(expense);
        res.status(204).end();
    }),
);

router.post(
    "/:id/approve",
    asyncHandler(async (req, res) => {
        const id = Number(req.params.id);
        db.approve(id);
        res.status(204).end();
    }),
);

router.get(
    "/",
    asyncHandler(async (req, res) => {
        const items = db.all(req.query);
        res.json(Array.from(items));
    }),
);

export default router;
