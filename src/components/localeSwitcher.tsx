import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "./localeSwitcherSelector";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        {
          value: 'en',
          label: t('en')
        },
        {
          value: 'jp',
          label: t('jp')
        }
      ]}
      label={t('label')}
    />
  );
}