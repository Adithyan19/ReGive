import React, { useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import EmblaAutoplayPlugin from 'embla-carousel-autoplay';

export function EventCarousel(props) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    EmblaAutoplayPlugin({
      delay: 3 * 1000,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    }),
  ]);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        <div
          key={`slide`}
          className="group embla__slide h-80 bg-center bg-no-repeat bg-cover rounded-md select-none border-2 hover:border-primary-500 transition-colors duration-200 hover:shadow-inner"
          style={{ backgroundImage: `url("${product.imageurl}")` }}
        >
          <Link href={`/product/${product.name}`}>
            <div className="flex flex-col justify-between w-full h-full p-8 bg-black/60 group-hover:bg-black/45 transition-all duration-200">
              <div>
                <div className="font-bold">{''}</div>
                <div className="font-black text-2xl">{product.name}</div>
                <div className="text-base">{product.description}</div>
              </div>
              <div>read more</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EmblaCarousel;
