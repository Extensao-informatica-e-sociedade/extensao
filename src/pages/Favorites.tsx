import { Heart } from "lucide-react";
import { contents } from "@/data/contents";
import { ContentCard } from "@/components/ContentCard";
import { useFavorites } from "@/hooks/useFavorites";

export default function Favorites() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const favContents = contents.filter((c) => favorites.includes(c.id));

  return (
    <div className="min-h-screen pb-24">
      <header className="px-5 pb-4 pt-12">
        <h1 className="text-2xl font-extrabold">Favoritos</h1>
        <p className="text-sm text-muted-foreground">Conteúdos que você salvou</p>
      </header>

      <main className="mx-auto max-w-lg px-5">
        {favContents.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Heart className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-bold">Nenhum favorito ainda</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Toque no ❤️ em qualquer conteúdo para salvá-lo aqui.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {favContents.map((c) => (
              <ContentCard key={c.id} content={c} isFavorite={isFavorite(c.id)} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
