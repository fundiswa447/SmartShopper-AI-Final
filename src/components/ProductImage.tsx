import { useEffect, useState } from 'react';
import { Image, ShoppingBag } from 'lucide-react';
import type { Product } from '../types';

interface ProductImageResult {
  imageUrl: string;
  sourceUrl: string;
  sourceTitle: string;
  artist?: string;
  license?: string;
}

const imageLookups = new Map<
  string,
  Promise<ProductImageResult | null>
>();

function findProductImage(query: string): Promise<ProductImageResult | null> {
  const key = query.toLocaleLowerCase();
  const cached = imageLookups.get(key);

  if (cached) return cached;

  const lookup = fetch(`/api/product-image?q=${encodeURIComponent(query)}`)
    .then(async (response) => {
      if (!response.ok) return null;
      const data = (await response.json()) as {
        image: ProductImageResult | null;
      };
      return data.image;
    })
    .catch(() => null);

  imageLookups.set(key, lookup);
  return lookup;
}

interface ProductImageProps {
  product: Product;
  className?: string;
}

export function ProductImage({ product, className = '' }: ProductImageProps) {
  const [matchedImage, setMatchedImage] =
    useState<ProductImageResult | null>(null);
  const [failed, setFailed] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    let active = true;
    setMatchedImage(null);
    setFailed(false);
    setUseFallback(false);

    if (!product.imageUrl) {
      findProductImage(product.title).then((image) => {
        if (active) {
          setMatchedImage(image);
          if (!image) setFailed(true);
        }
      });
    }

    return () => {
      active = false;
    };
  }, [product.id, product.title, product.imageUrl]);

  const imageUrl = useFallback
    ? matchedImage?.imageUrl
    : product.imageUrl || matchedImage?.imageUrl;

  const handleImageError = () => {
    if (product.imageUrl && !useFallback) {
      setUseFallback(true);
      findProductImage(product.title).then((image) => {
        if (image) setMatchedImage(image);
        else setFailed(true);
      });
      return;
    }
    setFailed(true);
  };

  if (!imageUrl || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
        {imageUrl ? <Image className="h-8 w-8" /> : <ShoppingBag className="h-8 w-8" />}
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <img
        src={imageUrl}
        alt={product.title}
        className={className}
        loading="lazy"
        onError={handleImageError}
      />
      {matchedImage && (
        <a
          href={matchedImage.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-x-0 bottom-0 truncate bg-black/65 px-2 py-1 text-[9px] text-white"
          title={`${matchedImage.sourceTitle}${matchedImage.artist ? `, ${matchedImage.artist}` : ''}${matchedImage.license ? `, ${matchedImage.license}` : ''}`}
        >
          Photo: {matchedImage.artist || matchedImage.sourceTitle}
          {matchedImage.license ? ` · ${matchedImage.license}` : ''}
        </a>
      )}
    </div>
  );
}