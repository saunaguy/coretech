'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { authenticatedFetch } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Mail, Calendar, HelpCircle, MessageSquare, FileText } from 'lucide-react'

interface UserProfile {
  username: string;
  email: string;
  created_at: string;
  role: string;
}

interface ProfileData {
  user: UserProfile;
  questions: string[];
  answers: string[];
  posts: string[];
}

export default function ProfilePage() {
  const { user: authUser } = useAuth()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser) return;
      setLoading(true);
      try {
        const data = await authenticatedFetch('/api/v1/profile');
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  if (loading) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  if (!profileData) {
    return <div className="text-center py-20">Could not load profile data.</div>;
  }

  const { user, questions, answers, posts } = profileData;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={`https://github.com/${user.username}.png`} alt={user.username} />
                <AvatarFallback className="text-3xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>Joined on {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Activity Tabs */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="questions">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="questions">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Questions ({questions.length})
                  </TabsTrigger>
                  <TabsTrigger value="answers">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Answers ({answers.length})
                  </TabsTrigger>
                  <TabsTrigger value="posts">
                    <FileText className="w-4 h-4 mr-2" />
                    Posts ({posts.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="questions" className="mt-4">
                  <div className="space-y-2">
                    {questions.length > 0 ? (
                      questions.map((q, i) => <div key={i} className="p-3 bg-secondary rounded-md text-sm">{q}</div>)
                    ) : (
                      <p className="text-sm text-muted-foreground text-center p-4">No questions asked yet.</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="answers" className="mt-4">
                  <div className="space-y-2">
                    {answers.length > 0 ? (
                      answers.map((a, i) => <div key={i} className="p-3 bg-secondary rounded-md text-sm truncate">{a}</div>)
                    ) : (
                      <p className="text-sm text-muted-foreground text-center p-4">No answers given yet.</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="posts" className="mt-4">
                  <div className="space-y-2">
                    {posts.length > 0 ? (
                      posts.map((p, i) => <div key={i} className="p-3 bg-secondary rounded-md text-sm">{p}</div>)
                    ) : (
                      <p className="text-sm text-muted-foreground text-center p-4">No posts created yet.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
