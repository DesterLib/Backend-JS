import { Router } from "express";
import reqBodySchema from "./schema";
import prisma from "../../../db/prisma";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const collections = await prisma.collection.findMany();
    return res.status(200).json(collections);
  } catch (error: any) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const collectionId = req.params.id;
  try {
    const collection = await prisma.collection.findUnique({
      where: {
        id: collectionId,
      },
    });
    return res.status(200).json(collection);
  } catch (error: any) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { success, data, error } = reqBodySchema.safeParse(req.body);

  if (!success) {
    return next({
      status: 400,
      message: "Validation failed",
      errors: error.errors,
    });
  }

  const { collectionName, collectionPath, mediaType } = data;

  try {
    const collection = await prisma.collection.create({
      data: {
        name: collectionName,
        path: collectionPath,
        mediaType: mediaType,
      },
    });
    return res.status(201).json({
      message: "Collection created successfully",
      collection,
    });
  } catch (error: any) {
    return next(error);
  }
});

export default router;
