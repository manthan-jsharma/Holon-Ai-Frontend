"use client";

import { useParams } from "next/navigation";
import MeetingDetailComponent from "@/components/meeting-detail";

export default function MeetingDetailPage() {
  const params = useParams();
  const meetingId = Number(params.id);

  return (
    <main>
      <MeetingDetailComponent meetingId={meetingId} />
    </main>
  );
}
