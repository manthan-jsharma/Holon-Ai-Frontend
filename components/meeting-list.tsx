"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Meeting, getMeetings, deleteMeeting } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function MeetingList() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const data = await getMeetings();
      setMeetings(data);
    } catch (error) {
      toast.error("Failed to load meetings", {
        description:
          "Please try again or contact support if the problem persists.",
      });
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm("Are you sure you want to delete this meeting?")) {
      try {
        setDeleting(id);
        await deleteMeeting(id);
        setMeetings(meetings.filter((meeting) => meeting.id !== id));
        toast.success("Meeting deleted", {
          description: "The meeting has been removed from your list.",
        });
      } catch (error) {
        toast.error("Delete failed", {
          description: "Failed to delete meeting. Please try again.",
        });
        console.error("Error deleting meeting:", error);
      } finally {
        setDeleting(null);
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meeting Summaries</h1>
        <Button
          onClick={() => router.push("/upload")}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          New Meeting
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No meetings yet</h3>
          <p className="mt-1 text-gray-500">
            Upload a meeting recording to get started.
          </p>
          <Button onClick={() => router.push("/upload")} className="mt-4">
            Upload Meeting
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <Link href={`/meetings/${meeting.id}`} key={meeting.id} passHref>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{meeting.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDelete(meeting.id, e)}
                      disabled={deleting === meeting.id}
                      className="h-8 w-8 p-0"
                    >
                      {deleting === meeting.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500 mb-2">
                    {meeting.date}
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(
                        meeting.status
                      )}`}
                    >
                      {meeting.status.charAt(0).toUpperCase() +
                        meeting.status.slice(1)}
                    </span>
                    {meeting.duration && (
                      <span className="text-xs text-gray-500">
                        {meeting.duration}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
