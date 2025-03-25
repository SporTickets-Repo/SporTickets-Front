import { CreateEventForm } from "@/components/pages/profile/organizer/create-event-form";
import { CreateEventProvider } from "@/context/create-event";

export default async function CreateEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <div className="container">
      <CreateEventProvider>
        <CreateEventForm eventId={eventId} />
      </CreateEventProvider>
    </div>
  );
}
