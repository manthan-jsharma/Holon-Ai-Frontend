import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadSection from "@/components/upload-section";
import MeetingsList from "@/components/meetings-list";
import RecentMeetings from "@/components/recent-meetings";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Meeting Assistant
          </h1>
          <p className="text-gray-600 mt-2">
            Transcribe, summarize, and organize your multilingual meetings
          </p>
        </header>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="upload">Upload Recording</TabsTrigger>
            <TabsTrigger value="meetings">My Meetings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-medium text-lg mb-2">Total Meetings</h3>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-medium text-lg mb-2">Hours Saved</h3>
                <p className="text-3xl font-bold">18.5</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-medium text-lg mb-2">Action Items</h3>
                <p className="text-3xl font-bold">24</p>
              </div>
            </div>

            <RecentMeetings />
          </TabsContent>

          <TabsContent value="upload">
            <UploadSection />
          </TabsContent>

          <TabsContent value="meetings">
            <MeetingsList />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
