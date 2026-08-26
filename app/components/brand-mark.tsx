import Image from "next/image";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/brand/nanda-logo.png"
        alt="Nanda Photography logo"
        width={96}
        height={96}
        className="h-12 w-12 object-contain sm:h-14 sm:w-14"
        priority
      />
      <span className="brand-wordmark text-2xl leading-none sm:text-3xl">Nanda Photography</span>
    </div>
  );
}
