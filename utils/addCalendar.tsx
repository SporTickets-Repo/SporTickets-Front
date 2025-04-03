export function generateGoogleCalendarLink({
  title,
  location,
  description,
  start,
  end,
}: {
  title: string;
  location: string;
  description?: string;
  start: Date;
  end: Date;
}) {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, "");
  };

  const base = "https://www.google.com/calendar/render?action=TEMPLATE";
  const params = new URLSearchParams({
    text: title,
    location,
    details: description || "",
    dates: `${formatDate(start)}/${formatDate(end)}`,
  });

  return `${base}&${params.toString()}`;
}
