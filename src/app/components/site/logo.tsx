import { Scale } from "lucide-react";

type Props = {
  className?: string;
  fullName?: string | null;
  faculty?: string | null;
  university?: string | null;
};

export function Logo({ className, fullName, faculty, university }: Props) {
  const name = fullName?.trim() || "أ.د. كريم بلحاج";
  const sub = [faculty?.trim(), university?.trim()]
    .filter(Boolean)
    .join(" · ") || "كلية الحقوق · جامعة الجزائر";

  return (
    <span
      className={
        "inline-flex items-center gap-2.5 " + (className ?? "")
      }
      aria-label="شعار الأستاذ"
    >
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/30">
        <Scale className="size-5" strokeWidth={2.2} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-amiri text-base font-bold text-foreground">
          {name}
        </span>
        <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
          {sub}
        </span>
      </span>
    </span>
  );
}
