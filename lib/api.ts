const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Meeting {
  id: number;
  title: string;
  date: string;
  status: string;
  duration?: string;
  language: string;
}

export interface MeetingDetail extends Meeting {
  transcript?: string;
  summary?: string;
  action_items?: Array<{
    text: string;
    assignee?: string;
    due_date?: string;
  }>;
  decisions?: Array<{
    text: string;
  }>;
  participants?: Array<{
    name: string;
  }>;
  error_message?: string;
}

export interface SearchResult {
  transcript_matches: string[];
  summary_match: string | null;
  action_item_matches: Array<{
    text: string;
    assignee?: string;
    due_date?: string;
  }>;
  decision_matches: Array<{
    text: string;
  }>;
}

// Get all meetings
export async function getMeetings(): Promise<Meeting[]> {
  try {
    const response = await fetch(`${API_URL}/meetings/`);

    if (!response.ok) {
      throw new Error(`Error fetching meetings: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch meetings:", error);
    throw error;
  }
}

// Get meeting details by ID
export async function getMeetingById(id: number): Promise<MeetingDetail> {
  try {
    const response = await fetch(`${API_URL}/meetings/${id}`);

    if (!response.ok) {
      throw new Error(`Error fetching meeting: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch meeting ${id}:`, error);
    throw error;
  }
}

// Create a new meeting
export async function createMeeting(
  formData: FormData
): Promise<{ id: number; title: string; status: string; language: string }> {
  try {
    const response = await fetch(`${API_URL}/meetings/`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header when sending FormData
    });

    if (!response.ok) {
      throw new Error(`Error creating meeting: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create meeting:", error);
    throw error;
  }
}

// Delete a meeting
export async function deleteMeeting(id: number): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_URL}/meetings/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error deleting meeting: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to delete meeting ${id}:`, error);
    throw error;
  }
}

// Export meeting as PDF
export async function exportMeetingAsPdf(id: number): Promise<Blob> {
  try {
    const response = await fetch(`${API_URL}/meetings/${id}/export`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Error exporting meeting: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error(`Failed to export meeting ${id}:`, error);
    throw error;
  }
}

// Search in meeting
export async function searchInMeeting(
  id: number,
  query: string
): Promise<SearchResult> {
  try {
    const response = await fetch(
      `${API_URL}/meetings/${id}/search?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`Error searching in meeting: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to search in meeting ${id}:`, error);
    throw error;
  }
}

// Check server health
export async function checkHealth(): Promise<{
  status: string;
  timestamp: string;
}> {
  try {
    const response = await fetch(`${API_URL}/health`);

    if (!response.ok) {
      throw new Error(`Error checking health: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to check server health:", error);
    throw error;
  }
}

export async function uploadMeeting(
  file: File,
  title: string,
  language: string
): Promise<{ id: number; title: string; status: string }> {
  const formData = new FormData();
  formData.append("audio_file", file);
  formData.append("title", title);
  formData.append("primary_language", language);

  try {
    const response = await fetch(`${API_URL}/meetings/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error uploading meeting: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to upload meeting:", error);
    throw error;
  }
}
