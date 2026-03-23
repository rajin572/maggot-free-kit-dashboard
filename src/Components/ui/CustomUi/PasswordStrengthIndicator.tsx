import { CheckCircle2, XCircle } from "lucide-react";

const rules = [
  { label: "কমপক্ষে ৮ অক্ষর", test: (p: string) => p.length >= 8 },
  { label: "একটি বড় হাতের অক্ষর (A-Z)", test: (p: string) => /[A-Z]/.test(p) },
  { label: "একটি ছোট হাতের অক্ষর (a-z)", test: (p: string) => /[a-z]/.test(p) },
  { label: "একটি সংখ্যা (0-9)", test: (p: string) => /[0-9]/.test(p) },
  { label: "একটি বিশেষ চিহ্ন (!@#$...)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      {rules.map((rule) => {
        const passed = rule.test(password);
        return (
          <div key={rule.label} className="flex items-center gap-2 text-xs">
            {passed ? (
              <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />
            ) : (
              <XCircle size={13} className="text-red-400 flex-shrink-0" />
            )}
            <span className={passed ? "text-green-600" : "text-red-400"}>{rule.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default PasswordStrengthIndicator;
