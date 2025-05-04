const API_URL = "http://localhost:8000";
export async function uploadMeeting(
  file: File,
  title: string,
  language: string
): Promise<{ id: string }> {
  const formData = new FormData();
  formData.append("audio_file", file);
  formData.append("title", title);
  formData.append("primary_language", language);

  const response = await fetch(`${API_URL}/meetings/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to upload meeting");
  }

  const data = await response.json();
  return { id: data.id.toString() };
}

export async function getMeetings() {
  const response = await fetch(`${API_URL}/meetings/`);

  if (!response.ok) {
    throw new Error("Failed to fetch meetings");
  }

  return await response.json();
}

export async function getMeetingById(id: string) {
  const response = await fetch(`${API_URL}/meetings/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch meeting");
  }

  return await response.json();
}

export async function deleteMeeting(id: string) {
  const response = await fetch(`${API_URL}/meetings/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete meeting");
  }

  return await response.json();
}

export async function exportMeetingAsPdf(id: string): Promise<Blob> {
  const response = await fetch(`${API_URL}/meetings/${id}/export`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to export meeting as PDF");
  }

  return await response.blob();
}

export async function searchInMeeting(id: string, query: string) {
  const response = await fetch(
    `${API_URL}/meetings/${id}/search?query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search in meeting");
  }

  return await response.json();
}
