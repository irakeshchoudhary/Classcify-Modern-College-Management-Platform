import { useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowUpDown,
  BarChart,
  BookOpen,
  Calendar,
  CheckCircle,
  ClipboardList,
  Download,
  Edit,
  Filter,
  LineChart,
  MoreVertical,
  Plus,
  Sliders,
  Trash,
  User,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
  Bar,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AdminAnalytics = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    date: new Date(),
    status: "active",
  });

  // Mock data
  const chartData = [
    { name: "Jan", users: 4000, revenue: 2400 },
    { name: "Feb", users: 3000, revenue: 1398 },
    { name: "Mar", users: 2000, revenue: 9800 },
    { name: "Apr", users: 2780, revenue: 3908 },
    { name: "May", users: 1890, revenue: 4800 },
    { name: "Jun", users: 2390, revenue: 3800 },
  ];

  const tableData = [
    {
      id: 1,
      name: "User Growth Report",
      category: "Users",
      date: "2024-03-01",
      status: "active",
    },
    {
      id: 2,
      name: "Revenue Analysis",
      category: "Finance",
      date: "2024-03-05",
      status: "archived",
    },
    {
      id: 3,
      name: "Marketing Campaign",
      category: "Marketing",
      date: "2024-03-10",
      status: "active",
    },
  ];

  const stats = [
    {
      title: "Total Users",
      value: "24,532",
      icon: Users,
      progress: 65,
      change: "+12.3%",
    },
    {
      title: "Active Sessions",
      value: "1,432",
      icon: Activity,
      progress: 48,
      change: "-2.1%",
    },
    {
      title: "Monthly Revenue",
      value: "$45,234",
      icon: BookOpen,
      progress: 78,
      change: "+24.7%",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      icon: CheckCircle,
      progress: 32,
      change: "+5.4%",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic
    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    // Add delete logic
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
              <stat.icon className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Progress value={stat.progress} className="h-2" />
                <span
                  className={`text-sm ${
                    stat.change.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Activity</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem>Year to date</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          {
            /* <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#2563eb" />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent> */
          }
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          {
            /* <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent> */
          }
        </Card>
      </div>

      {/* Data Table Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Analytics Reports</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {formData.id ? "Edit" : "Create"} Report
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="users">Users</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Date</Label>
                    <CalendarPicker
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({ ...formData, date })}
                      className="rounded-md border"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })}
                    />
                  </div>

                  <DialogFooter>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.status === "active"
                        ? "default"
                        : "secondary"}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of 5
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === 5}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Storage Usage</Label>
                <span className="text-sm text-muted-foreground">78% used</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>API Response Time</Label>
                <span className="text-sm text-muted-foreground">320ms avg</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">New user registration</h4>
                  <p className="text-sm text-muted-foreground">
                    2 hours ago - User #2345 registered
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
