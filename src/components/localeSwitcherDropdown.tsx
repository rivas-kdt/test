"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { LanguageIcon } from "@heroicons/react/24/solid";
import { setUserLocale } from "@/services/locale";
import { Locale } from "@/i18n/config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export default function LocaleSwitcherDropdown() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const items = [
    { value: "en", label: t("en") },
    { value: "jp", label: t("jp") },
  ];

  function switchLocale(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="languages" className="border-none">
        {/* The whole header row is now the trigger */}
        <AccordionTrigger
          disabled={isPending}
          className="flex items-center justify-between gap-2 py-2"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 border border-muted bg-muted rounded-full">
              <LanguageIcon className="h-[1.2rem] w-[1.2rem]" />
            </div>
            <span>{items.find((i) => i.value === locale)?.label}</span>
          </div>
        </AccordionTrigger>

        {/* Sliding dropdown list */}
        <AccordionContent className="pl-10 pr-4">
          <div className="flex flex-col rounded-sm border bg-background">
            {items.map((item) => (
              <button
                key={item.value}
                onClick={() => switchLocale(item.value)}
                className="px-3 py-2 text-left text-md"
              >
                {item.label}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
