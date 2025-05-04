"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  type MeetingDetail,
  getMeetingById,
  exportMeetingAsPdf,
  searchInMeeting,
  type SearchResult,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  FileDown,
  Search,
  Clock,
  Users,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

interface MeetingDetailProps {
  meetingId: number;
}

export default function MeetingDetailComponent({
  meetingId,
}: MeetingDetailProps) {
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const router = useRouter();

  useEffect(() => {
    fetchMeeting();

    // Poll for updates if the meeting is still processing
    const intervalId = setInterval(() => {
      if (meeting && meeting.status === "processing") {
        fetchMeeting();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [meetingId, meeting]);

  const fetchMeeting = async () => {
    try {
      setLoading(true);
      const data = await getMeetingById(meetingId);
      setMeeting(data);
    } catch (error) {
      toast.error("Failed to load meeting details", {
        description:
          "Please try again or contact support if the problem persists.",
      });
      console.error("Error fetching meeting:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setExporting(true);
      const blob = await exportMeetingAsPdf(meetingId);

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        `${meeting?.title.replace(/\s+/g, "_")}_notes.pdf` ||
        `meeting_${meetingId}_notes.pdf`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("PDF exported successfully", {
        description: "Your meeting notes have been exported as PDF.",
      });
    } catch (error) {
      toast.error("Export failed", {
        description: "Failed to export meeting as PDF. Please try again.",
      });
      console.error("Error exporting meeting:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      const results = await searchInMeeting(meetingId, searchQuery);
      setSearchResults(results);

      // Switch to the appropriate tab if results are found
      if (results.summary_match) {
        setActiveTab("summary");
      } else if (results.transcript_matches.length > 0) {
        setActiveTab("transcript");
      } else if (results.action_item_matches.length > 0) {
        setActiveTab("action-items");
      } else if (results.decision_matches.length > 0) {
        setActiveTab("decisions");
      }
    } catch (error) {
      toast.error("Search failed", {
        description: "Failed to search in meeting. Please try again.",
      });
      console.error("Error searching in meeting:", error);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
  };

  const highlightSearchTerm = (text: string, term: string) => {
    if (!term.trim() || !text) return text;

    const regex = new RegExp(
      `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Meeting not found</h3>
        <Button onClick={() => router.push("/")} className="mt-4">
          Back to Meetings
        </Button>
      </div>
    );
  }

  const isProcessing = meeting.status === "processing";
  const hasFailed = meeting.status === "failed";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{meeting.title}</h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center text-sm text-gray-500 mr-4">
            <Clock className="h-4 w-4 mr-1" />
            {meeting.date} {meeting.duration && `• ${meeting.duration}`}
          </div>

          {meeting.participants && meeting.participants.length > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              {meeting.participants.length} participant
              {meeting.participants.length !== 1 ? "s" : ""}
            </div>
          )}

          {!isProcessing && !hasFailed && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPdf}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <FileDown className="h-4 w-4 mr-1" />
              )}
              Export PDF
            </Button>
          )}
        </div>
      </div>

      {isProcessing && (
        <Card className="mb-6">
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin mr-2 text-primary" />
            <p>
              Processing your meeting recording. This may take a few minutes...
            </p>
          </CardContent>
        </Card>
      )}

      {hasFailed && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Processing Failed
            </h3>
            <p className="text-red-700">
              {meeting.error_message ||
                "There was an error processing your meeting recording."}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/upload")}
            >
              Try Again with Another Recording
            </Button>
          </CardContent>
        </Card>
      )}

      {!isProcessing && !hasFailed && (
        <>
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search in meeting..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
              <Button type="submit" disabled={searching || !searchQuery.trim()}>
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Search className="h-4 w-4 mr-1" />
                )}
                Search
              </Button>
              {searchResults && (
                <Button type="button" variant="ghost" onClick={clearSearch}>
                  Clear
                </Button>
              )}
            </div>
          </form>

          {searchResults && (
            <Card className="mb-6 bg-blue-50">
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">
                  Search Results for "{searchQuery}"
                </h3>
                <div className="text-sm">
                  {searchResults.transcript_matches.length +
                    (searchResults.summary_match ? 1 : 0) +
                    searchResults.action_item_matches.length +
                    searchResults.decision_matches.length}{" "}
                  matches found
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="action-items">Action Items</TabsTrigger>
              <TabsTrigger value="decisions">Decisions</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {meeting.summary ? (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: searchResults?.summary_match
                          ? highlightSearchTerm(meeting.summary, searchQuery)
                          : meeting.summary,
                      }}
                    />
                  ) : (
                    <p className="text-gray-500">No summary available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transcript">
              <Card>
                <CardHeader>
                  <CardTitle>Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  {meeting.transcript ? (
                    <div className="whitespace-pre-wrap font-mono text-sm">
                      {searchResults?.transcript_matches.length ? (
                        <div className="space-y-4">
                          {searchResults.transcript_matches.map((match, i) => (
                            <div
                              key={i}
                              className="p-2 bg-yellow-50 border-l-4 border-yellow-400"
                              dangerouslySetInnerHTML={{
                                __html: highlightSearchTerm(match, searchQuery),
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        meeting.transcript
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No transcript available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="action-items">
              <Card>
                <CardHeader>
                  <CardTitle>Action Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {meeting.action_items && meeting.action_items.length > 0 ? (
                    <ul className="space-y-3">
                      {(searchResults?.action_item_matches.length
                        ? searchResults.action_item_matches
                        : meeting.action_items
                      ).map((item, i) => (
                        <li
                          key={i}
                          className={`p-3 border rounded-md ${
                            searchResults?.action_item_matches.includes(item)
                              ? "bg-yellow-50"
                              : ""
                          }`}
                        >
                          <div
                            className="font-medium"
                            dangerouslySetInnerHTML={{
                              __html:
                                searchResults?.action_item_matches.includes(
                                  item
                                )
                                  ? highlightSearchTerm(item.text, searchQuery)
                                  : item.text,
                            }}
                          />
                          {item.assignee && (
                            <div className="text-sm text-gray-600 mt-1">
                              Assignee: {item.assignee}
                              {item.due_date && ` • Due: ${item.due_date}`}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No action items identified</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="decisions">
              <Card>
                <CardHeader>
                  <CardTitle>Key Decisions</CardTitle>
                </CardHeader>
                <CardContent>
                  {meeting.decisions && meeting.decisions.length > 0 ? (
                    <ul className="space-y-3">
                      {(searchResults?.decision_matches.length
                        ? searchResults.decision_matches
                        : meeting.decisions
                      ).map((decision, i) => (
                        <li
                          key={i}
                          className={`p-3 border rounded-md ${
                            searchResults?.decision_matches.includes(decision)
                              ? "bg-yellow-50"
                              : ""
                          }`}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: searchResults?.decision_matches.includes(
                                decision
                              )
                                ? highlightSearchTerm(
                                    decision.text,
                                    searchQuery
                                  )
                                : decision.text,
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No key decisions identified</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
