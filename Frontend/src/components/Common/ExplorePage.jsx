import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import postApi from "@/api/post.api";
import studentApi from "@/api/student.api";
import UserCard from "@/components/Common/UserCard";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchType, setSearchType] = useState("posts");

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          setIsLoading(true);
          if (searchType === "users") {
            const users = await studentApi.searchUsers(searchQuery);
            setSearchResults(users);
          } else {
            const posts = await postApi.searchPosts(searchQuery);
            setSearchResults(posts);
          }
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchType]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await postApi.getPosts();
        setAllPosts(posts);
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  const createPostGrid = () => {
    return (
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {allPosts.map((post) => (
          <Card
            key={post._id}
            className="group relative overflow-hidden rounded-xl transition-shadow hover:shadow-lg"
          >
            <CardHeader className="flex flex-row items-center space-y-0 p-4 pb-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {post.author?.personal?.firstName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3 space-y-1">
                <CardTitle className="text-sm font-semibold">
                  {post.author?.personal?.firstName}
                </CardTitle>
                <CardDescription className="text-xs">
                  {post.author?.academic?.course}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {post?.media?.resource_type === "video"
                ? (
                  <video
                    src={post?.media?.url}
                    className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    controls
                  />
                )
                : (
                  <img
                    src={post?.media?.url}
                    alt={post?.caption || "Post Image"}
                    className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
            </CardContent>

            <CardFooter className="flex flex-col items-start gap-2 p-4">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-primary/10"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.caption}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 bg-background z-10 p-4 text-center">
        <h1 className="text-2xl font-semibold mb-5">Explore</h1>
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            placeholder={`Search ${
              searchType === "users" ? "students" : "posts"
            }...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-4 h-10"
          />
          <Button
            variant={searchType === "users" ? "default" : "outline"}
            onClick={() => setSearchType("users")}
            className="h-10 cursor-pointer"
          >
            Users
          </Button>
          <Button
            variant={searchType === "posts" ? "default" : "outline"}
            onClick={() => setSearchType("posts")}
            className="h-10 cursor-pointer"
          >
            Posts
          </Button>
        </div>
      </div>

      {searchQuery
        ? (
          <ScrollArea className="h-[calc(100vh-120px)] p-4">
            {isLoading
              ? (
                <div className="grid gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              )
              : searchResults.length > 0
              ? (
                searchType === "users"
                  ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.map((user) => (
                        <UserCard key={user._id} user={user} />
                      ))}
                    </div>
                  )
                  : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.map((post) => (
                        <Card key={post._id}>
                          <CardContent className="p-0">
                            {post.media.resource_type === "video"
                              ? (
                                <video
                                  src={post.media.url}
                                  className="w-full rounded-lg"
                                  controls
                                />
                              )
                              : (
                                <img
                                  src={post.media.url}
                                  alt={post.caption}
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                              )}
                          </CardContent>
                          <CardFooter className="p-3 flex flex-col items-start">
                            <p className="text-sm font-medium">
                              {post.caption}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs text-blue-500"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )
              )
              : <p className="text-center text-gray-500">No results found</p>}
          </ScrollArea>
        )
        : (
          <ScrollArea className="h-[calc(100vh-120px)]">
            {isLoading
              ? (
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="break-inside-avoid mb-4">
                      <Skeleton className="h-64 w-full" />
                    </div>
                  ))}
                </div>
              )
              : (
                createPostGrid()
              )}
          </ScrollArea>
        )}
    </div>
  );
};

export default ExplorePage;
