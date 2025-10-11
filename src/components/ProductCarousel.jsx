// src/components/ProductCarousel.jsx
import React, { useRef, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductCarousel({ products = [] }) {
  const autoplay = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      containScroll: 'trimSnaps',
      skipSnaps: false,
    },
    [autoplay.current]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="relative py-10 group">
      <h2 className="text-2xl font-semibold mb-6 text-center">Recently Donated Products</h2>

      {/* Embla viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4 md:gap-6">
          {products.map((product, idx) => (
            <div
              key={idx}
              className={cn(
                'flex-shrink-0',
                'w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] xl:w-[calc(20%-1.2rem)]',
                'min-w-0',
                idx === products.length - 1 ? 'mr-4 md:mr-6' : ''
              )}
            >
              <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 ">
                <CardHeader className="space-y-2 pb-3">
                  <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {product.category}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col space-y-3 pb-4">
                  <div className="w-full aspect-[4/3] rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 px-1">
                    {product.description || 'No description available.'}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between items-center pt-4 border-t">
                  <p className="font-bold text-xl text-gray-900">₹{product.price}</p>
                  <Button size="sm" className="rounded-full px-6 bg-amber-700 hover:bg-amber-800">
                    Buy
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canScrollPrev}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-opacity duration-300 md:hidden z-10 hover:bg-gray-50"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canScrollNext}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-opacity duration-300 md:hidden z-10 hover:bg-gray-50"
      >
        <ArrowRight className="w-5 h-5 text-gray-700" />
      </button>
    </section>
  );
}
