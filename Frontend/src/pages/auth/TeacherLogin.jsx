// TeacherLogin.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TeacherLogin() {
  return (
    <div className="w-96 bg-white p-8 rounded-lg shadow-xl cursor-grab">
      <h2 className="text-2xl font-bold mb-6 text-center">Teacher Login</h2>
      <form className="space-y-4">
        <div>
          <Label htmlFor="uid">Teacher UID</Label>
          <Input id="uid" placeholder="Enter your UID" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="passwordd" type="password" placeholder="••••••••" />
        </div>
        <Button className="w-full">Sign In</Button>
      </form>
    </div>
  );
}