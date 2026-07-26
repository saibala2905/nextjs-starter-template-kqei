import Fuse from "fuse.js";

import entities from "@/data/entities.json";
import { Entity } from "@/types/investigation";

const fuse = new Fuse(entities as Entity[], {
  threshold: 0.35,
  includeScore: true,
  keys: [
    "id",
    "label",
    "type",
    "description",
    "tags",
  ],
});

export function searchEntities(query: string): Entity[] {
  if (!query.trim()) {
    return [];
  }

  return fuse.search(query).map((item) => item.item);
}