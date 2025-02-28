import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Bell,
  CalendarCheck,
  Clock,
  Download,
  LibraryBig,
  MapPin,
  Printer,
  RefreshCw,
  User,
} from "lucide-react";
import studentApi from "@/api/student.api";
import { TailSpin } from "react-loader-spinner";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const StudentClassroom = () => {
  const [studentData, setStudentData] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("timetable");
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, timetable, assignments, announcements] = await Promise
          .all([
            studentApi.getProfile(),
            studentApi.getTimetable(),
            studentApi.getAssignments(),
            studentApi.getAnnouncements(),
          ]);

        setStudentData(profile.data);
        setTimetable(timetable.data);
        setAssignments(assignments.data);
        setAnnouncements(announcements.data);
      } catch (err) {
        setError(err.message || "Failed to load classroom data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const getAssignmentStatus = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) return { status: "Overdue", variant: "destructive" };
    if (daysDiff <= 3) return { status: "Urgent", variant: "destructive" };
    if (daysDiff <= 7) return { status: "Pending", variant: "warning" };
    return { status: "Upcoming", variant: "secondary" };
  };

  {
    assignments.map((assignment) => {
      const { status, variant } = getAssignmentStatus(assignment.dueDate);
      return (
        <TableRow key={assignment._id}>
          <TableCell className="py-3">
            <div className="space-y-1">
              <div className="font-medium">{assignment.subject}</div>
              <div className="text-sm text-muted-foreground">
                Due: {format(new Date(assignment.dueDate), "PPp")}
              </div>
            </div>
          </TableCell>
          <TableCell className="text-right py-3">
            <Badge variant={variant}>{status}</Badge>
          </TableCell>
        </TableRow>
      );
    });
  }

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const [timetable, assignments, announcements] = await Promise.all([
        studentApi.getTimetable(),
        studentApi.getAssignments(),
        studentApi.getAnnouncements(),
      ]);

      setTimetable(timetable.data);
      setAssignments(assignments.data);
      setAnnouncements(announcements.data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const renderAnnouncements = () => {
    if (announcements.length === 0) {
      return (
        <div className="p-6 text-center text-muted-foreground">
          No recent announcements
        </div>
      );
    }

    return announcements.map((announcement) => (
      <div key={announcement._id} className="p-4 border-b border-gray-200">
        <h3 className="font-medium">{announcement.title}</h3>
        <p className="text-sm text-muted-foreground">
          {announcement.description}
        </p>
      </div>
    ));
  };

  const renderTimetable = () => {
    if (!timetable || timetable.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={5}
            className="text-center text-muted-foreground py-8"
          >
            No classes scheduled for today
          </TableCell>
        </TableRow>
      );
    }
    return (
      <TableBody>
        {timetable.map((lecture) => (
          <TableRow key={lecture._id}>
            <TableCell className="font-medium">
              {format(new Date(lecture.startTime), "HH:mm")}
            </TableCell>
            <TableCell>{lecture.subject}</TableCell>
            <TableCell>
              <Tooltip>
                <TooltipTrigger>
                  <span className="underline decoration-dotted">
                    {lecture.lecturer}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Email: {lecture.lecturerEmail}</p>
                  <p>Office: Block {lecture.office}</p>
                </TooltipContent>
              </Tooltip>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                <MapPin className="mr-1 h-3 w-3" />
                {lecture.room}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {Math.abs(
                new Date(lecture.endTime) - new Date(lecture.startTime),
              ) / (1000 * 60)} mins
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <TailSpin color="#3B82F6" height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="text-red-600">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Error Loading Classroom Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to Your Classroom, {studentData.personal.firstName}!
            </h1>
            <div className="flex gap-4">
              <Button variant="outline">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
            </div>
          </div>

          {/* Quick Access Toolbar */}
          <div className="grid grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center"
            >
              <LibraryBig className="h-6 w-6 mb-2" />
              Study Materials
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center"
            >
              <CalendarCheck className="h-6 w-6 mb-2" />
              Academic Calendar
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center"
            >
              <Download className="h-6 w-6 mb-2" />
              Resources
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center"
            >
              <User className="h-6 w-6 mb-2" />
              My Profile
            </Button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - ID Card and Resources */}
            <div className="space-y-6 lg:col-span-1">
              {/* Digital ID Card */}
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">
                        Student ID Card
                      </CardTitle>
                      <CardDescription>Valid through 2026</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Full Name
                        </p>
                        <p className="font-medium">
                          {`${studentData.personal.firstName} ${studentData.personal.lastName}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">College</p>
                        <p className="font-medium">
                          {studentData.academic.collegeName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Course</p>
                        <p className="font-medium">
                          {studentData.academic.course}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-24 w-24 bg-gray-200 rounded-lg mx-auto" />
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Student ID
                        </p>
                        <p className="font-mono text-xs">
                          {studentData._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-blue-100/50 py-3">
                  <div className="flex justify-between items-center w-full text-sm">
                    <span className="text-muted-foreground">
                      Admission: {studentData.academic.admissionYear}
                    </span>
                    <span className="text-blue-600">Active Status</span>
                  </div>
                </CardFooter>
              </Card>

              {/* Upcoming Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5" />
                    Upcoming Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-72">
                    {assignments.length > 0
                      ? (
                        <Table>
                          <TableBody>
                            {assignments.map((assignment) => (
                              <TableRow key={assignment._id}>
                                <TableCell className="py-3">
                                  <div className="space-y-1">
                                    <div className="font-medium">
                                      {assignment.subject}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      Due: {format(
                                        new Date(assignment.dueDate),
                                        "PPp",
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right py-3">
                                  <Badge
                                    variant={assignment.status === "pending"
                                      ? "destructive"
                                      : "secondary"}
                                  >
                                    {assignment.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )
                      : (
                        <div className="p-6 text-center text-muted-foreground">
                          No upcoming assignments
                        </div>
                      )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Middle Column - Timetable */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Today's Schedule
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Weekly
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[100px]">Time</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Lecturer</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead className="text-right">Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timetable.map((lecture) => (
                        <TableRow key={lecture._id}>
                          <TableCell className="font-medium">
                            {format(new Date(lecture.startTime), "HH:mm")}
                          </TableCell>
                          <TableCell>{lecture.subject}</TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="underline decoration-dotted">
                                  {lecture.lecturer}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Email: {lecture.lecturerEmail}</p>
                                <p>Office: Block {lecture.office}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              <MapPin className="mr-1 h-3 w-3" />
                              {lecture.room}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {Math.abs(
                              new Date(lecture.endTime) -
                                new Date(lecture.startTime),
                            ) / (1000 * 60)} mins
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Additional Classroom Sections */}
              <div className="grid grid-cols-2 gap-6 mt-6">
                {/* Academic Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Attendance</span>
                      <Badge variant="outline">92%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>CGPA</span>
                      <Badge variant="outline">3.8/4.0</Badge>
                    </div>
                    <Separator />
                    <div className="text-sm text-muted-foreground">
                      Last updated: {format(new Date(), "PP")}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Resources */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full">
                      Download Syllabus
                    </Button>
                    <Button variant="outline" className="w-full">
                      Lecture Recordings
                    </Button>
                    <Button variant="outline" className="w-full">
                      Lab Manuals
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Announcements */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>College Announcements</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    {renderAnnouncements()}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StudentClassroom;
