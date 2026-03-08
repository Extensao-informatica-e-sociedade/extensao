export type ContentFormat = "article" | "video" | "checklist";
export type Category = "gestao" | "marketing";

export interface ChecklistItem {
  id: string;
  text: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  category: Category;
  format: ContentFormat;
  icon: string;
  body: string;
  videoUrl?: string;
  imageUrl?: string;
  templateUrl?: string;
  templateLabel?: string;
  checklist?: ChecklistItem[];
  featured?: boolean;
}
