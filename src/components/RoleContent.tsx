import type { Role } from "@/data/resume";
import BulletList from "@/components/BulletList";

export default function RoleContent({ role }: { role: Role }) {
  const bulletsBefore = role.products
    ? role.bullets.slice(0, -1)
    : role.bullets;
  const bulletAfter = role.products
    ? role.bullets[role.bullets.length - 1]
    : null;

  return (
    <div>
      <BulletList items={bulletsBefore} />

      {role.products && (
        <div className="grid grid-cols-2 gap-2.5 my-3 ml-5 max-md:grid-cols-1">
          {role.products.map((product) => (
            <div
              key={product.name}
              className="bg-warm rounded-[10px] px-3.5 py-2.5 text-[0.82rem] leading-[1.45] text-body"
            >
              <strong className="block text-ink font-bold text-[0.8rem]">
                {product.name}
              </strong>
              {product.description}
            </div>
          ))}
        </div>
      )}

      {bulletAfter && <BulletList items={[bulletAfter]} className="mt-3" />}
    </div>
  );
}
