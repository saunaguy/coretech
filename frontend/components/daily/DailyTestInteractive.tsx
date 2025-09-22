'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, HelpCircle } from "lucide-react"
import { format } from "date-fns";

export default function DailyTestInteractive({ item }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { 
    title = "제목 없음", 
    category = "미분류", 
    difficulty = "미정", 
    createdAt = new Date().toISOString(), 
    question = item.question || "문제가 제공되지 않았습니다.", // item.content -> item.question으로 수정
    options = [],
    answer = "",
    explanation = ""
  } = item;

  const handleSubmit = () => {
    if (selectedOption) {
      setIsSubmitted(true);
    }
  };

  const getOptionStyle = (option) => {
    if (!isSubmitted) {
      return selectedOption === option 
        ? "border-primary bg-primary/10"
        : "border-border hover:bg-muted/50";
    }

    const isCorrect = option === answer;
    const isSelected = option === selectedOption;

    if (isCorrect) return "border-green-500 bg-green-500/10 text-green-700 font-semibold";
    if (isSelected && !isCorrect) return "border-red-500 bg-red-500/10 text-red-700 font-semibold";
    return "border-border text-muted-foreground";
  };

  const getOptionIcon = (option) => {
    if (!isSubmitted) {
        return <HelpCircle className="h-5 w-5 text-muted-foreground/50" />;
    }
    if (option === answer) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (option === selectedOption && option !== answer) return <XCircle className="h-5 w-5 text-red-500" />;
    return <HelpCircle className="h-5 w-5 text-muted-foreground/50" />;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant={difficulty === '초급' ? 'default' : difficulty === '중급' ? 'destructive' : 'outline'}>{difficulty}</Badge>
          </div>
        </div>
        <CardDescription>
          {format(new Date(createdAt), 'yyyy-MM-dd HH:mm')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <p className="text-lg leading-relaxed">{question}</p>
        
        {options.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">보기</h3>
            <div className="space-y-2">
              {options.map((opt, index) => (
                <button 
                  key={index} 
                  onClick={() => !isSubmitted && setSelectedOption(opt)}
                  disabled={isSubmitted}
                  className={`w-full p-3 rounded-md border flex items-center gap-3 text-left transition-colors ${getOptionStyle(opt)}`}
                >
                  {getOptionIcon(opt)}
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!isSubmitted ? (
            <Button onClick={handleSubmit} disabled={!selectedOption} className="w-full">
                제출하기
            </Button>
        ) : (
            explanation && (
                <div className="p-4 bg-muted rounded-lg space-y-2 animate-in fade-in-50">
                    <h3 className="font-semibold">해설</h3>
                    <p className="text-muted-foreground leading-relaxed">{explanation}</p>
                </div>
            )
        )}
      </CardContent>
    </Card>
  );
}
