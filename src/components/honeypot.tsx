import { HONEYPOT_FIELD } from "@/lib/form-guard";

// Hidden from people (and screen readers); bots that fill every field trip it.
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Leave this empty
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
