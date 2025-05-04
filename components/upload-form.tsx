"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createMeeting } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Upload, FileAudio } from "lucide-react";
import { toast } from "sonner";

export default function UploadForm() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("english");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isAudioFile(droppedFile)) {
        setFile(droppedFile);
      } else {
        toast.error("Invalid file type", {
          description: "Please upload an audio file (MP3, WAV, M4A, etc.)",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isAudioFile(selectedFile)) {
        setFile(selectedFile);
      } else {
        toast.error("Invalid file type", {
          description: "Please upload an audio file (MP3, WAV, M4A, etc.)",
        });
        e.target.value = "";
      }
    }
  };

  const isAudioFile = (file: File) => {
    return (
      file.type.startsWith("audio/") ||
      file.name.endsWith(".mp3") ||
      file.name.endsWith(".wav") ||
      file.name.endsWith(".m4a") ||
      file.name.endsWith(".ogg")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Missing title", {
        description: "Please enter a meeting title",
      });
      return;
    }

    if (!file) {
      toast.error("Missing file", {
        description: "Please upload an audio recording",
      });
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("primary_language", language);
      formData.append("audio_file", file);

      const result = await createMeeting(formData);

      toast.success("Upload successful", {
        description:
          "Your meeting is being processed. You'll be redirected to the meetings list.",
      });

      // Redirect to meetings list after a short delay
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      toast.error("Upload failed", {
        description:
          "There was an error uploading your meeting. Please try again.",
      });
      console.error("Error uploading meeting:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Upload Meeting Recording</CardTitle>
          <CardDescription>
            Upload an audio recording of your meeting to generate a transcript
            and summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Quarterly Review Meeting"
                disabled={uploading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Primary Language</Label>
              <Select
                value={language}
                onValueChange={setLanguage}
                disabled={uploading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="mandarin">Mandarin</SelectItem>
                  <SelectItem value="cantonese">Cantonese</SelectItem>
                  <SelectItem value="mixed">Mixed (Auto-detect)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audio">Audio Recording</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  dragActive ? "border-primary bg-primary/5" : "border-gray-300"
                } ${file ? "bg-green-50" : ""}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex flex-col items-center">
                    <FileAudio className="h-10 w-10 text-green-500 mb-2" />
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setFile(null)}
                      disabled={uploading}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium">
                      Drag and drop your audio file here, or{" "}
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports MP3, WAV, M4A, and other audio formats
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  id="audio"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploading || !file || !title.trim()}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload and Process"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
