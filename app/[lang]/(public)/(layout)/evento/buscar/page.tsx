import { SearchEventClient } from "@/components/pages/event/search/search-event-client-page";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

interface Props {
  params: { lang: Locale };
}

export default async function SearchEventPage({ params }: Props) {
  const dictionary = await getDictionary(params.lang);
  return <SearchEventClient lang={params.lang} dictionary={dictionary} />;
}
