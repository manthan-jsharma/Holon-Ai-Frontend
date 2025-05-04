"use client";

import { useState, useEffect } from "react";
import { Search, FileText, Download, Trash2, Loader2 } from "lucide-react";
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
import {
  getMeetings,
  deleteMeeting,
  exportMeetingAsPdf,
  type Meeting,
} from "@/lib/api";

export default function MeetingsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await getMeetings();
        setMeetings(data);
      } catch (error) {
        toast.error("Failed to fetch meetings", {
          description:
            "Please try again or contact support if the problem persists.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewMeeting = (id: number) => {
    router.push(`/meetings/${id}`);
  };

  const handleExportPDF = async (id: number) => {
    try {
      toast.info("Exporting PDF", {
        description: "Your meeting notes are being exported as PDF.",
      });

      const pdfBlob = await exportMeetingAsPdf(id);

      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `meeting-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("PDF Exported", {
        description: "Your meeting notes have been exported successfully.",
      });
    } catch (error) {
      toast.error("Export Failed", {
        description: "Failed to export meeting notes. Please try again.",
      });
    }
  };

  const handleDeleteMeeting = async (id: number) => {
    try {
      await deleteMeeting(id);
      setMeetings(meetings.filter((meeting) => meeting.id !== id));
      toast.success("Meeting deleted", {
        description: "The meeting has been removed from your list.",
      });
    } catch (error) {
      toast.error("Delete Failed", {
        description: "Failed to delete meeting. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading meetings...</span>
      </div>
    );
  }

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
                  <TableCell>{meeting.duration || "Processing..."}</TableCell>
                  <TableCell>{meeting.language}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        meeting.status === "completed" ? "default" : "secondary"
                      }
                    >
                      {meeting.status === "completed"
                        ? "Completed"
                        : meeting.status === "processing"
                        ? "Processing"
                        : "Failed"}
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
                          onClick={() => handleExportPDF(meeting.id)}
                          disabled={meeting.status !== "completed"}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export PDF
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
