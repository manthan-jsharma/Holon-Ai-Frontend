"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Search,
  Clock,
  Calendar,
  Users,
  MessageSquare,
  CheckSquare,
  Bookmark,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Mock data for a specific meeting
const MEETING_DETAILS = {
  id: "1",
  title: "Q1 Planning Meeting",
  date: "April 10, 2023",
  duration: "45 min",
  participants: [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Chen",
    "Alex Wong",
  ],
  language: "English",
  summary:
    "The Q1 Planning Meeting focused on reviewing the previous quarter's performance and setting objectives for Q2. The team discussed market trends in Hong Kong and identified opportunities for growth. Key metrics showed a 15% increase in user engagement but a slight decline in revenue from the enterprise segment. The product team presented the roadmap for Q2, highlighting new features aimed at improving customer retention. The marketing team proposed a new campaign targeting the financial sector in Hong Kong.",
  actionItems: [
    {
      text: "John to prepare market analysis report by April 15",
      assignee: "John Doe",
      dueDate: "2023-04-15",
    },
    {
      text: "Jane to update the product roadmap with Q2 priorities",
      assignee: "Jane Smith",
      dueDate: "2023-04-12",
    },
    {
      text: "Mike to schedule follow-up meeting with the sales team",
      assignee: "Mike Johnson",
      dueDate: "2023-04-11",
    },
    {
      text: "Sarah to revise the marketing budget allocation",
      assignee: "Sarah Chen",
      dueDate: "2023-04-18",
    },
    {
      text: "Alex to prepare competitive analysis for the Hong Kong market",
      assignee: "Alex Wong",
      dueDate: "2023-04-20",
    },
  ],
  decisions: [
    "Increase marketing budget for Hong Kong region by 20%",
    "Prioritize mobile app features for Q2 development cycle",
    "Revise pricing strategy for enterprise customers",
    "Launch new customer retention program by end of April",
  ],
  transcript: `
John: Good morning everyone. Let's get started with our Q1 planning meeting. First, I'd like to review our performance from last quarter.

Jane: I've prepared the slides. As you can see, we've had a 15% increase in user engagement across all platforms.

Mike: That's great news. However, I'm concerned about the slight decline in revenue from our enterprise segment.

Sarah: I agree. We need to address this in our Q2 strategy. I think we should revise our pricing model for enterprise customers.

John: Good point. Let's make that a priority for Q2. What about our expansion plans for Hong Kong?

Alex: The market research shows promising opportunities in Hong Kong, especially in the financial sector. I suggest we increase our marketing efforts there.

Jane: That aligns well with our product roadmap. We're planning to release features that would be particularly valuable for financial institutions.

Mike: How does this affect our budget allocation?

Sarah: I propose we increase the marketing budget for Hong Kong by 20%. We can adjust other regions if necessary.

John: Let's do that. Alex, can you prepare a competitive analysis for the Hong Kong market?

Alex: Yes, I'll have that ready by April 20th.

John: Great. Jane, please update the product roadmap with our Q2 priorities.

Jane: Will do. I'll have that by April 12th.

Mike: Should I schedule a follow-up with the sales team to discuss the enterprise segment?

John: Yes, please do that by next week. Sarah, please revise the marketing budget allocation based on our discussion today.

Sarah: I'll have that ready by April 18th.

John: Excellent. I'll prepare a detailed market analysis report by April 15th. Any other items we need to discuss?

[No response]

John: Alright, let's wrap up then. Thank you everyone for your input.
  `,
};

export default function MeetingDetails() {
  const params = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [meeting] = useState(MEETING_DETAILS);

  const handleExportPDF = () => {
    toast.info("Exporting PDF", {
      description: "Your meeting notes are being exported as PDF.",
    });
    // In a real implementation, this would trigger the PDF export
  };

  const handleShare = () => {
    toast.success("Share link copied", {
      description: "A shareable link has been copied to your clipboard.",
    });
    // In a real implementation, this would copy a share link to clipboard
  };

  const highlightSearchTerms = (text: string) => {
    if (!searchQuery.trim()) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const filteredTranscript = searchQuery.trim()
    ? meeting.transcript
        .split("\n")
        .filter((line) =>
          line.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : meeting.transcript.split("\n");

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{meeting.title}</h1>
          <Badge className="ml-3">{meeting.language}</Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-1" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-1" />
          {meeting.date}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-1" />
          {meeting.duration}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-1" />
          {meeting.participants.length} Participants
        </div>
      </div>

      <div className="relative w-full mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search in meeting notes and transcript..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="summary">
            <MessageSquare className="h-4 w-4 mr-1" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="action-items">
            <CheckSquare className="h-4 w-4 mr-1" />
            Action Items
          </TabsTrigger>
          <TabsTrigger value="decisions">
            <Bookmark className="h-4 w-4 mr-1" />
            Decisions
          </TabsTrigger>
          <TabsTrigger value="transcript">
            <MessageSquare className="h-4 w-4 mr-1" />
            Full Transcript
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-700 whitespace-pre-line">
                {highlightSearchTerms(meeting.summary)}
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Participants</h3>
                <div className="flex flex-wrap gap-2">
                  {meeting.participants.map((participant, index) => (
                    <Badge key={index} variant="outline">
                      {participant}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="action-items">
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {meeting.actionItems.map((item, index) => (
                  <li key={index} className="border-b pb-3 last:border-0">
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm mr-3 mt-0.5">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {highlightSearchTerms(item.text)}
                        </p>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <span className="mr-3">
                            Assignee: {item.assignee}
                          </span>
                          <span>Due: {item.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions">
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {meeting.decisions.map((decision, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <p>{highlightSearchTerms(decision)}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcript">
          <Card>
            <CardContent className="pt-6">
              <div className="whitespace-pre-line font-mono text-sm">
                {filteredTranscript.map((line, index) => (
                  <div key={index} className={line.trim() ? "mb-2" : "mb-4"}>
                    {highlightSearchTerms(line)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
