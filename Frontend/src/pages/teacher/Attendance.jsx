import React, { useEffect, useState } from 'react';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Loader2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import teacherApi from '@/api/teacher.api';
import studentApi from '@/api/student.api';
import { TailSpin } from 'react-loader-spinner';
import { format, addDays, subDays, parseISO } from 'date-fns';

const Attendance = ({ role }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [isTeacher] = useState(role === 'teacher');

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (isTeacher) {
          const coursesRes = await teacherApi.getTeacherCourses();
          setCourses(coursesRes.data.courses);
        }
        loadAttendance();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      let data;
      if (isTeacher) {
        data = await teacherApi.getTeacherAttendance({
          date: selectedDate,
          course: selectedCourse,
          subject: selectedSubject
        });
      } else {
        data = await studentApi.getStudentAttendance();
      }
      setAttendanceData(data.data);
      setOriginalData(JSON.parse(JSON.stringify(data.data)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (days) => {
    const newDate = addDays(selectedDate, days);
    setSelectedDate(newDate);
    loadAttendance();
  };

  const handleStatusChange = (studentId, status) => {
    if (!isTeacher) return;
    
    setAttendanceData(prev => prev.map(item => 
      item.student._id === studentId ? { ...item, status } : item
    ));
  };

  const handleSave = async () => {
    try {
      await teacherApi.updateAttendance({
        date: selectedDate,
        course: selectedCourse,
        subject: selectedSubject,
        attendanceData: attendanceData.map(item => ({
          studentId: item.student._id,
          status: item.status
        }))
      });
      toast({ title: "Attendance updated successfully" });
      loadAttendance();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to update attendance",
        description: err.message
      });
    }
  };

  const hasChanges = JSON.stringify(attendanceData) !== JSON.stringify(originalData);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <TailSpin color="#3B82F6" height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isTeacher ? 'Attendance Management' : 'My Attendance'}
        </h1>
        {isTeacher && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleDateChange(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              {format(selectedDate, 'dd MMM yyyy')}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDateChange(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Teacher Controls */}
      {isTeacher && (
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Select Course</Label>
            <Select
              value={selectedCourse}
              onValueChange={setSelectedCourse}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Subject</Label>
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={loadAttendance}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isTeacher 
              ? `Students List (${attendanceData.length})`
              : `Attendance Records (${format(new Date(), 'MMMM yyyy')})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  {isTeacher && <TableHead>Student Name</TableHead>}
                  <TableHead>Date</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  {isTeacher && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record._id}>
                    {isTeacher && (
                      <TableCell>
                        {record.student.personal.firstName}{' '}
                        {record.student.personal.lastName}
                      </TableCell>
                    )}
                    <TableCell>
                      {format(parseISO(record.date), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>{record.course}</TableCell>
                    <TableCell>{record.subject}</TableCell>
                    <TableCell>
                      <Badge
                        variant={record.status === 'present' ? 'default' : 'destructive'}
                        className={cn(
                          'capitalize',
                          !isTeacher && 'rounded-full px-3 py-1 text-sm'
                        )}
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    {isTeacher && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={record.status === 'present' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(record.student._id, 'present')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={record.status === 'absent' ? 'destructive' : 'outline'}
                            onClick={() => handleStatusChange(record.student._id, 'absent')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>

        {isTeacher && (
          <CardFooter className="flex justify-end gap-4">
            <Button 
              variant="outline"
              onClick={() => setAttendanceData(originalData)}
              disabled={!hasChanges}
            >
              Discard Changes
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!hasChanges}
            >
              Save Attendance
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Attendance;