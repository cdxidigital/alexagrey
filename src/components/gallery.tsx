import { useState } from "react";
import { Eye, Lock, Play, X } from "lucide-react";
import { media } from "@/lib/site-data";
import { FadeIn } from "@/components/fade-in";
import { cn } from "@/lib/utils";

type Item = (typeof media.gallery)[number];

function Tile({
  item,
  revealed,
  index,
  onOpen,
}: {
  item: Item;
  revealed: boolean;
  index: number;
  onOpen: (item: Item) => void;
}) {
  const tall = index % 3 === 0;
  return (
    <button
      type="button"
      data-testid={`gallery-item-${index}`}
      onClick={() => revealed && onOpen(item)}
      className={cn(
        "group relative block w-full overflow-hidden rounded-xl",
        tall ? "row-span-2 aspect-[3/4]" : "aspect-square",
        revealed ? "cursor-zoom-in" : "cursor-default",
      )}
    >
      {item.type === "image" ? (
        <img
          src={item.src}
          alt="Alexa gallery"
          className="h-full w-full object-cover transition-[filter,transform] duration-700 group-hover:scale-105"
          style={{
            filter: revealed ? "none" : "blur(26px)",
            transform: revealed ? "none" : "scale(1.08)",
          }}
        />
      ) : (
        <video
          src={item.src}
          muted
          loop
          playsInline
          autoPlay={revealed}
          className="h-full w-full object-cover transition-[filter,transform] duration-700 group-hover:scale-105"
          style={{
            filter: revealed ? "none" : "blur(26px)",
            transform: revealed ? "none" : "scale(1.08)",
          }}
        />
      )}
      {item.type === "video" && revealed && (
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/60 p-2 text-gold backdrop-blur">
          <Play size={14} />
        </span>
      )}
    </button>
  );
}

export function Gallery() {
  const [revealed, setRevealed] = useState(false);
  const [open, setOpen] = useState<Item | null>(null);

  return (
    <section
      id="gallery"
      data-testid="media-gallery"
      className="relative bg-surface/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <FadeIn>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="label-text">Gallery</p>
              <h2 className="mt-3 heading-serif text-4xl font-light md:text-5xl">
                Recent & verified
              </h2>
              <p className="mt-3 max-w-md font-sans text-sm font-light text-muted">
                Photos and clips are blurred for your discretion. Opt in to reveal.
              </p>
            </div>
            <button
              type="button"
              data-testid="gallery-reveal-btn"
              onClick={() => setRevealed((v) => !v)}
              className={revealed ? "btn-ghost" : "btn-gold"}
            >
              {revealed ? (
                <>
                  <Lock size={16} /> Blur media
                </>
              ) : (
                <>
                  <Eye size={16} /> Reveal media (18+)
                </>
              )}
            </button>
          </div>
        </FadeIn>
        <div className="relative mt-12">
          <div className="grid auto-rows-[minmax(0,1fr)] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {media.gallery.map((item, i) => (
              <Tile
                key={item.src + i}
                item={item}
                index={i}
                revealed={revealed}
                onOpen={setOpen}
              />
            ))}
          </div>
          {!revealed && (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              data-testid="gallery-overlay-reveal"
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            >
              <span className="glass flex flex-col items-center gap-3 rounded-2xl px-10 py-8 text-center">
                <Lock className="text-gold" size={28} />
                <span className="max-w-xs font-serif text-xl font-light text-cream">
                  Content hidden for your privacy
                </span>
                <span className="btn-gold mt-1 px-6 py-2.5 text-xs">
                  <Eye size={15} /> Tap to reveal
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-xl"
          onClick={() => setOpen(null)}
          data-testid="gallery-lightbox"
        >
          <button
            type="button"
            className="absolute right-5 top-5 text-cream/70 transition-colors hover:text-gold"
            onClick={() => setOpen(null)}
            aria-label="Close"
          >
            <X size={30} />
          </button>
          {open.type === "image" ? (
            <img
              src={open.src}
              alt="Alexa"
              className="max-h-[88vh] max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video
              src={open.src}
              controls
              autoPlay
              playsInline
              className="max-h-[88vh] max-w-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </section>
  );
}
