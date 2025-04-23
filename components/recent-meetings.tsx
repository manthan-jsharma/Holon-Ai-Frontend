"use client";

import { useRouter } from "next/navigation";
import { FileText, Clock, Calendar, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data for recent meetings
const RECENT_MEETINGS = [
  {
    id: "1",
    title: "Q1 Planning Meeting",
    date: "April 10, 2023",
    duration: "45 min",
    participants: ["John Doe", "Jane Smith", "Mike Johnson"],
    summary:
      "Discussed Q1 results and planned initiatives for Q2. Key focus areas include expanding the Hong Kong market and improving customer retention rates.",
    actionItems: [
      "John to prepare market analysis by April 15",
      "Jane to update the product roadmap",
      "Mike to schedule follow-up with the sales team",
    ],
    language: "English",
  },
  {
    id: "2",
    title: "Product Team Sync",
    date: "April 8, 2023",
    duration: "30 min",
    participants: ["Jane Smith", "Alex Wong", "Sarah Chen"],
    summary:
      "Reviewed current sprint progress. UI redesign is on track, but backend integration is facing some delays due to API changes.",
    actionItems: [
      "Alex to coordinate with the backend team on API changes",
      "Sarah to complete the UI mockups by Wednesday",
      "Jane to update the sprint board",
    ],
    language: "Mixed",
  },
  {
    id: "3",
    title: "Client Presentation",
    date: "April 5, 2023",
    duration: "60 min",
    participants: ["Mike Johnson", "Li Wei", "Client Team"],
    summary:
      "Presented the new platform features to the client. Overall positive feedback with some concerns about the timeline for the mobile app release.",
    actionItems: [
      "Mike to send follow-up email with timeline details",
      "Li to prepare additional documentation on mobile features",
      "Schedule technical review with client's IT team",
    ],
    language: "Mandarin",
  },
];

export default function RecentMeetings() {
  const router = useRouter();

  const handleViewMeeting = (id: string) => {
    router.push(`/meetings/${id}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Meetings</h2>

      <div className="grid grid-cols-1 gap-6">
        {RECENT_MEETINGS.map((meeting) => (
          <Card key={meeting.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{meeting.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {meeting.date}
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    {meeting.duration}
                  </CardDescription>
                </div>
                <Badge>{meeting.language}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" /> Summary
                </h4>
                <p className="text-sm text-gray-600">{meeting.summary}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Action Items</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {meeting.actionItems.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewMeeting(meeting.id)}
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
