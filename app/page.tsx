import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AcceptedResult from "@/components/accepted-result"
import RejectedResult from "@/components/rejected-result"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-purple-600 mb-8">HiDevs Project Evaluation</h1>

        <Tabs defaultValue="accepted" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="accepted" className="text-lg">
              Accepted
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-lg">
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accepted">
            <AcceptedResult />
          </TabsContent>

          <TabsContent value="rejected">
            <RejectedResult />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
