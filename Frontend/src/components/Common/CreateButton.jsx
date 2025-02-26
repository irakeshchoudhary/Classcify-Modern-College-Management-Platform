import { Plus, UploadCloud, X, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDropzone } from "react-dropzone";

const CreateButton = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      setFile(uploadedFile);
      const fileURL = URL.createObjectURL(uploadedFile);
      setPreview(fileURL);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(10);
    
    setTimeout(() => setProgress(50), 1000);
    setTimeout(() => setProgress(100), 2000);
    setTimeout(() => {
      setLoading(false);
      alert("Post created successfully!");
    }, 2500);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*,video/*",
    maxFiles: 1,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="h-14 w-14 bg-[#432DD7] rounded-full flex items-center justify-center text-white fixed bottom-5 right-5 cursor-pointer shadow-lg hover:bg-[#2c1bb6] transition">
          <Plus />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create New Post</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input type="text" placeholder="Title" required className="border rounded-lg p-2" />
          
          <Select>
            <SelectTrigger className="border rounded-lg p-2">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-100 transition relative">
            <input {...getInputProps()} />
            {file ? (
              <div className="relative flex flex-col items-center">
                {file.type.startsWith("image") && (
                  <img src={preview} alt="Preview" className="w-full h-auto rounded-lg" />
                )}
                {file.type.startsWith("video") && (
                  <video className="w-full h-auto rounded-lg" controls>
                    <source src={preview} type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                )}
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud className="w-8 h-8 text-gray-500" />
                <p className="text-gray-500 text-sm mt-2">Drag & drop or click to upload</p>
              </div>
            )}
          </div>
          
          <Input type="text" placeholder="Tags (comma separated)" className="border rounded-lg p-2" />
          <Textarea placeholder="Description" required className="border rounded-lg p-2" />
          
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          )}
          
          <Button type="submit" className="bg-[#432DD7] text-white w-full hover:bg-[#2c1bb6] transition" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateButton;
