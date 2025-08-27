import React from 'react';
import { Github, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const AboutPage = () => {
  const technologies = [
    { name: "React", icon: "⚛️" },
    { name: "Node.js", icon: "🟢" },
    { name: "Gemini", icon: "✨" },
    { name: "GitHub", icon: "🐙" },
  ]

  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Full Stack Developer",
      github: "alexchen",
      avatar: "/professional-developer-avatar.png",
    },
    {
      name: "Sarah Kim",
      role: "AI Engineer",
      github: "sarahkim",
      avatar: "/ai-engineer-avatar.png",
    },
    {
      name: "Mike Johnson",
      role: "UI/UX Designer",
      github: "mikejohnson",
      avatar: "/diverse-designer-avatars.png",
    },
    {
      name: "Lisa Wang",
      role: "Product Manager",
      github: "lisawang",
      avatar: "/product-manager-avatar.png",
    },
  ]

  return (
    <div className="text-center space-y-16">
      {/* About Section */}
      <section className="space-y-6">
        <h1 className="text-4xl font-bold text-foreground text-balance">About Coretech</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
          Coretech is a powerful platform designed to help users compare and analyze responses from multiple AI
          models. Our mission is to democratize AI interaction by providing an an intuitive interface where users can
          experiment with different prompts and see how various AI systems respond, enabling better understanding
          and more effective AI utilization.
        </p>
      </section>

      {/* Technology Stack Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-foreground">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          {technologies.map((tech) => (
            <Card key={tech.name} className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0 space-y-3">
                <div className="text-4xl">{tech.icon}</div>
                <h3 className="font-medium text-foreground">{tech.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-foreground">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <Card
              key={member.name}
              className="p-6 text-center hover:scale-105 transition-transform duration-200 hover:shadow-lg"
            >
              <CardContent className="p-0 space-y-4">
                <img
                  src={member.avatar || "/placeholder.svg"}
                  alt={`${member.name} avatar`}
                  className="w-20 h-20 rounded-full mx-auto object-cover"
                />
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <a
                    href={`https://github.com/${member.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;