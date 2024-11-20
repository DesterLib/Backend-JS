import { z } from "zod";

const reqBodySchema = z.object({
  collectionName: z.string({ message: "collectionName is required." }),
  collectionPath: z.string({ message: "collectionPath is required." }),
  mediaType: z.enum(["movie", "tvshow", "manga", "music"]),
});

export default reqBodySchema;
