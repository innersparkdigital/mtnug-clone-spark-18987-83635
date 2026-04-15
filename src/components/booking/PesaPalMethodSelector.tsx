import { CreditCard, Smartphone } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PesaPalMethodSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  idPrefix: string;
}

const paymentOptions = [
  {
    value: "mobile_money",
    label: "PesaPal Mobile Money",
    description: "Pay with Mobile Money on the secure PesaPal checkout page.",
    icon: Smartphone,
  },
  {
    value: "visa",
    label: "PesaPal Visa / Card",
    description: "Pay securely with Visa or another supported bank card.",
    icon: CreditCard,
  },
] as const;

const PesaPalMethodSelector = ({ value = "", onChange, idPrefix }: PesaPalMethodSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-medium text-foreground">Pay with PesaPal</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose your preferred method below and continue to the secure PesaPal payment page.
        </p>
      </div>

      <RadioGroup onValueChange={onChange} value={value} className="grid gap-3 sm:grid-cols-2">
        {paymentOptions.map((option) => {
          const Icon = option.icon;
          const inputId = `${idPrefix}_${option.value}`;
          const isSelected = value === option.value;

          return (
            <Label
              key={option.value}
              htmlFor={inputId}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/40"
              )}
            >
              <RadioGroupItem value={option.value} id={inputId} className="mt-1" />
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Icon className="h-4 w-4 text-primary" />
                  <span>{option.label}</span>
                </div>
                <p className="text-xs leading-5 text-muted-foreground">{option.description}</p>
              </div>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default PesaPalMethodSelector;