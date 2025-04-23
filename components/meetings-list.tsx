"use client";

import { useState } from "react";
import { Search, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

// Mock data for meetings
const MOCK_MEETINGS = [
  {
    id: "1",
    title: "Q1 Planning Meeting",
    date: "2023-04-10",
    duration: "45 min",
    language: "English",
    status: "completed",
  },
  {
    id: "2",
    title: "Product Team Sync",
    date: "2023-04-08",
    duration: "30 min",
    language: "Mixed",
    status: "completed",
  },
  {
    id: "3",
    title: "Client Presentation",
    date: "2023-04-05",
    duration: "60 min",
    language: "Mandarin",
    status: "completed",
  },
  {
    id: "4",
    title: "Weekly Team Standup",
    date: "2023-04-03",
    duration: "15 min",
    language: "Cantonese",
    status: "completed",
  },
  {
    id: "5",
    title: "Marketing Strategy",
    date: "2023-04-01",
    duration: "90 min",
    language: "English",
    status: "processing",
  },
];

export default function MeetingsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [meetings, setMeetings] = useState(MOCK_MEETINGS);
  const router = useRouter();

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewMeeting = (id: string) => {
    router.push(`/meetings/${id}`);
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== id));
    toast.success("Meeting deleted", {
      description: "The meeting has been removed from your list.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Meetings</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search meetings..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMeetings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  No meetings found
                </TableCell>
              </TableRow>
            ) : (
              filteredMeetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell className="font-medium">{meeting.title}</TableCell>
                  <TableCell>{meeting.date}</TableCell>
                  <TableCell>{meeting.duration}</TableCell>
                  <TableCell>{meeting.language}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        meeting.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {meeting.status === "completed"
                        ? "Completed"
                        : "Processing"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewMeeting(meeting.id)}
                          disabled={meeting.status !== "completed"}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Notes
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDeleteMeeting(meeting.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
