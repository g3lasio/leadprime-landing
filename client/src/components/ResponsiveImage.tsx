type ResponsiveImageProps = {
  asset: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  widths?: number[];
  className?: string;
  imgClassName?: string;
};

/**
 * Static responsive images with AVIF first, WebP fallback and no layout shift.
 * All current landing imagery is deliberately below the fold, so this component
 * enforces deferred loading and asynchronous decode.
 */
export default function ResponsiveImage({
  asset,
  alt,
  width,
  height,
  sizes,
  widths = [480, 768, 1200, 1600],
  className,
  imgClassName,
}: ResponsiveImageProps) {
  const srcSet = (extension: "avif" | "webp") =>
    widths.map((candidate) => `/images/v1/${asset}-${candidate}.${extension} ${candidate}w`).join(", ");
  const fallbackWidth = widths[Math.min(1, widths.length - 1)];

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        src={`/images/v1/${asset}-${fallbackWidth}.webp`}
        srcSet={srcSet("webp")}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={imgClassName}
      />
    </picture>
  );
}
