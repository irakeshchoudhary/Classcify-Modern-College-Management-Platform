import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
// import { useToast } from "@/components/ui/use-toast"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import CalendarPicker from "@/components/ui/CalendarPicker";

const AdminDashboard = () => {
  // const { toast } = useToast()
  const [date, setDate] = useState(new Date());
  const [progress, setProgress] = useState(78);

  // Mock data
  const recentTeachers = [
    {
      id: 1,
      name: "Sarah Smith",
      subject: "Mathematics",
      status: "Active",
      classes: 5,
    },
    {
      id: 2,
      name: "John Doe",
      subject: "Physics",
      status: "Pending",
      classes: 3,
    },
    {
      id: 3,
      name: "Emma Wilson",
      subject: "Chemistry",
      status: "Active",
      classes: 4,
    },
  ];

  const systemStats = [
    { title: "Total Teachers", value: "45", progress: 65 },
    { title: "Active Students", value: "1,234", progress: 78 },
    { title: "Total Classes", value: "32", progress: 45 },
    { title: "Storage Used", value: "78%", progress: 78 },
  ];

  const announcements = [
    { id: 1, title: "New Academic Calendar Released", date: "2024-03-15" },
    { id: 2, title: "Staff Meeting Reminder", date: "2024-03-18" },
    { id: 3, title: "System Maintenance Notice", date: "2024-03-20" },
  ];

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="grid grid-cols-5 gap-4 p-6">
        {/* Left Sidebar */}
        <div className="col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Add New Teacher
              </Button>
              <Button variant="outline" className="w-full">
                Create Announcement
              </Button>
              <Button variant="outline" className="w-full">
                Schedule Event
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarPicker />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-4 space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            {systemStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardDescription>{stat.title}</CardDescription>
                  <CardTitle className="text-3xl">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={stat.progress} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity Tabs */}
          <Tabs defaultValue="teachers" className="space-y-4">
            <TabsList>
              <TabsTrigger value="teachers">Recent Teachers</TabsTrigger>
              <TabsTrigger value="students">Student Admissions</TabsTrigger>
              <TabsTrigger value="system">System Health</TabsTrigger>
            </TabsList>

            <TabsContent value="teachers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recently Added Staff</CardTitle>
                  <CardDescription>
                    Last 3 teachers added to the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Classes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTeachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell>{teacher.name}</TableCell>
                          <TableCell>{teacher.subject}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded ${
                                teacher.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {teacher.status}
                            </span>
                          </TableCell>
                          <TableCell>{teacher.classes}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost">•••</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Student Admissions</CardTitle>
                  <CardDescription>
                    Recent student registrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            New Student Signups
                          </p>
                          <p className="text-sm text-muted-foreground">
                            45 students this week
                          </p>
                        </div>
                      </div>
                      <Progress value={65} className="w-[40%]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Announcements Carousel */}
          <Card>
            <CardHeader>
              <CardTitle>Important Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <Carousel className="w-full">
                <CarouselContent>
                  {announcements.map((announcement) => (
                    <CarouselItem key={announcement.id}>
                      <div className="p-6 border rounded-lg bg-background">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {announcement.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Published: {announcement.date}
                            </p>
                          </div>
                          <Button variant="outline">View Details</Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>

          {/* Quick Action Form */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Broadcast</CardTitle>
              <CardDescription>
                Send immediate announcement to all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="message">Broadcast Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your announcement..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex gap-4">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="teachers">Teachers Only</SelectItem>
                      <SelectItem value="students">Students Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit">Send Broadcast</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default AdminDashboard;
