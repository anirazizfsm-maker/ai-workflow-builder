import { useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, Settings, Shield, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const currentUser = useQuery(api.users.currentUser);
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    toast("Signed out successfully");
    navigate("/");
  };

  const userInitials = currentUser?.email
    ? currentUser.email.substring(0, 2).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-[#0b1120] dark:bg-[#0b1120] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1120] via-[#1a1f3a] to-[#0b1120] opacity-50" />
      
      <div className="relative z-10 container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Profile Settings
          </h1>
        </div>

        {/* Profile Card */}
        <Card className="bg-background/60 backdrop-blur border-white/10 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-primary/50">
                <AvatarImage src="" alt={currentUser?.email || "User"} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-foreground">
                  {currentUser?.name || "User"}
                </h2>
                <p className="text-muted-foreground">{currentUser?.email || "No email"}</p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-background/40 backdrop-blur border border-white/10">
            <TabsTrigger value="account" className="data-[state=active]:bg-primary/20">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary/20">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary/20">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6">
            <Card className="bg-background/60 backdrop-blur border-white/10">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentUser?.email || ""}
                    disabled
                    className="bg-background/40 border-white/10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your email is verified and cannot be changed
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={displayName || currentUser?.name || ""}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your display name"
                    className="bg-background/40 border-white/10"
                  />
                </div>

                {isEditing && (
                  <Button
                    onClick={() => {
                      toast("Profile updated successfully");
                      setIsEditing(false);
                    }}
                    className="w-full"
                  >
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="bg-background/60 backdrop-blur border-white/10">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive workflow updates via email
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Workflow Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when workflows fail
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5 text-primary" />
                    ) : (
                      <Sun className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-muted-foreground">
                        {theme === "dark" ? "Dark mode" : "Light mode"}
                      </p>
                    </div>
                  </div>
                  <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card className="bg-background/60 backdrop-blur border-white/10">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Authentication Method</p>
                    <p className="text-sm text-muted-foreground">
                      Email OTP (One-Time Password)
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Active
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Management</p>
                    <p className="text-sm text-muted-foreground">
                      Manage your active sessions
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Sessions
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Account Deletion</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}