'use client';

import { useMemo, useState } from 'react';

interface GalleryItem {
  image: string;
  alt: string;
}

export function AutoScrollGallery({ items }: { items: GalleryItem[] }) {
  const [paused, setPaused] = useState(false);
  const doubledItems = useMemo(() => [...items, ...items], [items]);

  return (
    <div className="overflow-hidden pb-2" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        className="flex w-max gap-4"
        style={{
          animation: 'landing-gallery-marquee 45s linear infinite',
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {doubledItems.map((item, index) => (
          <div
            key={`${item.image}-${index}`}
            className="h-64 overflow-hidden rounded-2xl border border-gray-200 shadow-card shrink-0 basis-[85vw] md:basis-[45vw] lg:basis-[33.333vw]"
          >
            <img src={item.image} alt={item.alt} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes landing-gallery-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 0.5rem));
          }
        }
      `}</style>
    </div>
  );
}
