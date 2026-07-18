import { useState } from 'react';

interface Props {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="card-premium flex aspect-video items-center justify-center">
        <span className="text-neutral-500">Sin imágenes</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="card-premium overflow-hidden">
        <img
          src={images[0]}
          alt={title}
          className="aspect-video w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="card-premium relative overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`${title} - Imagen ${currentIndex + 1}`}
          className="aspect-video w-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-dark/80 text-white transition-colors hover:bg-dark"
              aria-label="Imagen anterior"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-dark/80 text-white transition-colors hover:bg-dark"
              aria-label="Imagen siguiente"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === currentIndex ? 'bg-gold' : 'bg-white/50'
                  }`}
                  aria-label={`Ir a imagen ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === currentIndex ? 'border-gold' : 'border-transparent'
              }`}
            >
              <img
                src={img}
                alt={`Miniatura ${i + 1}`}
                className="h-16 w-16 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
