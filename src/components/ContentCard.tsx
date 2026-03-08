import { Link } from "react-router-dom";
import { Heart, FileText, Video, CheckSquare } from "lucide-react";
import * as Icons from "lucide-react";
import { Content } from "@/data/types";
import { cn } from "@/lib/utils";

const formatIcons = {
  article: FileText,
  video: Video,
  checklist: CheckSquare,
};

const formatLabels = {
  article: "Artigo",
  video: "Vídeo",
  checklist: "Checklist",
};

interface ContentCardProps {
  content: Content;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function ContentCard({ content, isFavorite, onToggleFavorite }: ContentCardProps) {
  const FormatIcon = formatIcons[content.format];
  const IconComponent = (Icons as any)[content.icon] || FileText;

  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md">
      <Link to={`/conteudo/${content.id}`} className="block p-4">
        <div className="mb-3 flex items-start justify-between">
          <div className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            content.category === "gestao"
              ? "bg-primary/10 text-primary"
              : "bg-secondary/10 text-secondary"
          )}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <FormatIcon className="h-3 w-3" />
              {formatLabels[content.format]}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(content.id);
              }}
              className="rounded-full p-1.5 transition-colors hover:bg-muted"
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
                )}
              />
            </button>
          </div>
        </div>
        <h3 className="mb-1 font-semibold leading-snug text-card-foreground">{content.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{content.description}</p>
      </Link>
    </div>
  );
}
