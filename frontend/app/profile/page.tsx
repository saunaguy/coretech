'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { authenticatedFetch } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from "@/components/ui/progress"
import { User, Mail, Calendar, HelpCircle, MessageSquare, FileText, TrendingUp, CheckCircle } from 'lucide-react'

// --- Interfaces for the new data structure ---
interface UserProfile {
  username: string;
  email: string;
  created_at: string;
  role: string;
}

interface QuestionSummary {
  id: number;
  title: string;
  created_at: string;
  views: number;
  answered: boolean;
}

interface AnswerSummary {
  id: number;
  content: string;
  created_at: string;
  parent_id: number;
  parent_title: string;
}

interface PostSummary {
  id: number;
  title: string;
  created_at: string;
  views: number;
}

interface ProgressData {
  category: string;
  percent: number;
}

interface ProfileData {
  user: UserProfile;
  questions: QuestionSummary[];
  answers: AnswerSummary[];
  posts: PostSummary[];
  progress: ProgressData[];
}

// --- Helper component for list items ---
const ActivityItem = ({ href, title, date, stats }: { href: string; title: string; date: string; stats: React.ReactNode }) => (
  <Link href={href} passHref>
    <div className="p-3 bg-secondary rounded-md hover:bg-primary/10 transition-colors">
      <p className="font-semibold truncate">{title}</p>
      <div className="flex justify-between items-center mt-1">
        <p className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString()}</p>
        <div className="text-xs text-muted-foreground flex items-center gap-2">{stats}</div>
      </div>
    </div>
  </Link>
);

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

  const { user, questions, answers, posts, progress } = profileData;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Profile & Progress */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                <AvatarImage src={`https://github.com/${user.username}.png`} alt={user.username} />
                <AvatarFallback className="text-3xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <p className="text-sm font-semibold text-primary">{user.role}</p>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
                <div className="flex items-center text-muted-foreground">
                    <Mail className="w-4 h-4 mr-3" />
                    <span>{user.email}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-3" />
                    <span>Joined on {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2"/>
                Daily Quiz Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {progress.length > 0 ? progress.map(p => (
                <div key={p.category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{p.category}</span>
                    <span className="text-sm font-medium">{p.percent}%</span>
                  </div>
                  <Progress value={p.percent} />
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center p-4">No quiz progress yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Activity Tabs */}
        <div className="lg:col-span-2">
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
                      questions.map(q => 
                        <ActivityItem 
                          key={`q-${q.id}`} 
                          href={`/qna/${q.id}`}
                          title={q.title} 
                          date={q.created_at}
                          stats={<><TrendingUp className="w-3 h-3"/>{q.views}</>}
                        />
                      )
                    ) : (
                      <p className="text-sm text-muted-foreground text-center p-4">No questions asked yet.</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="answers" className="mt-4">
                  <div className="space-y-2">
                    {answers.length > 0 ? (
                      answers.map(a => 
                        <ActivityItem 
                          key={`a-${a.id}`} 
                          href={`/qna/${a.parent_id}`}
                          title={a.content} 
                          date={a.created_at}
                          stats={<span className="font-semibold text-xs">To: {a.parent_title}</span>}
                        />
                      )
                    ) : (
                      <p className="text-sm text-muted-foreground text-center p-4">No answers given yet.</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="posts" className="mt-4">
                  <div className="space-y-2">
                    {posts.length > 0 ? (
                      posts.map(p => 
                        <ActivityItem 
                          key={`p-${p.id}`} 
                          href={`/board/${p.id}`}
                          title={p.title} 
                          date={p.created_at}
                          stats={<><TrendingUp className="w-3 h-3"/>{p.views}</>}
                        />
                      )
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
