import TabContacts from "@/components/features/contacts/TabContacts";
import TabInvitations from "@/components/features/invitations/TabInvitations";
import TabTemplates from "@/components/features/templates/TabTemplates";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, BookUser, FileText } from "lucide-react";

const Dashboard = () => {

  return (
    <main className="max-w-4xl mx-auto py-4 mt-8">
      <Tabs defaultValue="invitations">

        <ScrollArea>
          <TabsList className="before:bg-border relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
            <TabsTrigger value="invitations" className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none">
              <BookOpen className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />Daftar Undangan
            </TabsTrigger>
            <TabsTrigger value="templates" className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none">
              <FileText className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />Template Ucapan
            </TabsTrigger>
            <TabsTrigger value="contacts" className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none">
              <BookUser className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />Daftar Kontak
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="invitations">
          <TabInvitations />
        </TabsContent>
        <TabsContent value="templates">
          <TabTemplates />
        </TabsContent>
        <TabsContent value="contacts">
          <TabContacts />
        </TabsContent>

      </Tabs>
    </main>
  );
};

export default Dashboard;
