import type { Id } from "@/convex/_generated/dataModel";

export type FAQ = {
  _id: Id<"faqs">;
  _creationTime: number;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  isActive: boolean;
};
