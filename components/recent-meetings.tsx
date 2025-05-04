"use client";

import { useRouter } from "next/navigation";
import { FileText, Clock, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getMeetings, type Meeting } from "@/lib/api";
import { toast } from "sonner";

export default function RecentMeetings() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await getMeetings();
        // Sort by date and take the 3 most recent completed meetings
        const recentMeetings = data
          .filter((meeting) => meeting.status === "completed")
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 3);

        setMeetings(recentMeetings);
      } catch (error) {
        toast.error("Failed to load recent meetings", {
          description:
            "Please try again or contact support if the problem persists.",
        });
        console.error("Error fetching meetings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const handleViewMeeting = (id: number) => {
    router.push(`/meetings/${id}`);
  };

  if (loading || meetings.length === 0) {
    return null; // Don't show anything if loading or no meetings
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Meetings</h2>

      <div className="grid grid-cols-1 gap-6">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{meeting.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {meeting.date}
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    {meeting.duration || "Unknown"}
                  </CardDescription>
                </div>
                <Badge>{meeting.language}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewMeeting(meeting.id)}
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Meeting Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
