"use client";

import type React from "react";

import { useState } from "react";
import { Upload, Mic, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function UploadSection() {
  const [file, setFile] = useState<File | null>(null);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [primaryLanguage, setPrimaryLanguage] = useState("english");
  const [isUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  //   if (!file) {
  //     toast.error("No file selected", {
  //       description: "Please select an audio file to upload",
  //     });
  //     return;
  //   }

  //   if (!meetingTitle.trim()) {
  //     toast.error("Meeting title required", {
  //       description: "Please provide a title for your meeting",
  //     });
  //     return;
  //   }

  //   setIsUploading(true);

  //   try {
  //     // In a real implementation, this would call the API to upload and process the file
  //     await uploadMeeting(file, meetingTitle, primaryLanguage);

  //     toast.success("Upload successful", {
  //       description:
  //         "Your meeting is being processed. You'll be notified when it's ready.",
  //     });

  //     // Reset form
  //     setFile(null);
  //     setMeetingTitle("");
  //     setPrimaryLanguage("english");
  //   } catch (error) {
  //     toast.error("Upload failed", {
  //       description:
  //         "There was an error uploading your meeting: ${error.message}. Please try again.",
  //     });
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.success("Recording stopped", {
        description:
          "Your recording has been saved. Please provide a title and upload.",
      });
      // In a real implementation, this would save the recording as a file
      // and set it as the current file
    } else {
      setIsRecording(true);
      toast.info("Recording started", {
        description: "Recording your meeting. Click again to stop.",
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Meeting Recording</CardTitle>
        <CardDescription>
          Upload an audio recording of your meeting or record directly in the
          app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="meeting-title">Meeting Title</Label>
          <Input
            id="meeting-title"
            placeholder="Q1 Planning Meeting"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Primary Language</Label>
          <RadioGroup
            value={primaryLanguage}
            onValueChange={setPrimaryLanguage}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="english" id="english" />
              <Label htmlFor="english">English</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mandarin" id="mandarin" />
              <Label htmlFor="mandarin">Mandarin</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cantonese" id="cantonese" />
              <Label htmlFor="cantonese">Cantonese</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mixed" id="mixed" />
              <Label htmlFor="mixed">Mixed (Multiple Languages)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Upload Audio File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
              <Input
                type="file"
                accept="audio/*"
                className="hidden"
                id="audio-upload"
                onChange={handleFileChange}
              />
              <Label
                htmlFor="audio-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  {file ? file.name : "Click to upload"}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Supports MP3, WAV, M4A
                </span>
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Record Directly</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="lg"
                className="h-20 w-20 rounded-full"
                onClick={toggleRecording}
              >
                <Mic
                  className={`h-10 w-10 ${isRecording ? "animate-pulse" : ""}`}
                />
              </Button>
              <span className="text-sm font-medium text-gray-700 mt-2">
                {isRecording ? "Recording..." : "Click to start recording"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          disabled={isUploading || (!file && !isRecording)}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Upload and Process Meeting"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
