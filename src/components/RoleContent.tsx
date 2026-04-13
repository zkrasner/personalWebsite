import Link from "next/link";
import type { Role, RoleProduct } from "@/data/resume";
import AccentOutline from "@/components/AccentOutline";
import { bulletClass } from "@/components/BulletList";

function ProductCard({ product }: { product: RoleProduct }) {
  const cardClass =
    "block relative bg-warm rounded-card px-3.5 py-2.5 pr-8 text-sm leading-[1.45] text-body border border-ink h-full";

  const content = (
    <>
      <strong className="block text-ink font-bold text-sm">
        {product.name}
      </strong>
      {product.description}
      {product.slug && (
        <span
          aria-hidden="true"
          className="absolute bottom-2 right-3 text-accent text-sm opacity-60 transition-opacity duration-200 group-hover:opacity-100"
        >
          &rarr;
        </span>
      )}
    </>
  );

  if (product.slug) {
    return (
      <AccentOutline size="sm" variant="filled">
        <Link
          href={`/projects/${product.slug}`}
          className={`${cardClass} relative z-2 group no-underline card-hover border-ink focus-ring`}
        >
          {content}
        </Link>
      </AccentOutline>
    );
  }

  return <div className={cardClass}>{content}</div>;
}

export default function RoleContent({ role }: { role: Role }) {
  return (
    <ul className="list-none p-0">
      {role.bullets.map((bullet, i) => (
        <li key={i} className={bulletClass}>
          {bullet.text}
          {bullet.products && bullet.products.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-3 max-md:grid-cols-1">
              {bullet.products.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
