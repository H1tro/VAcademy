"use client";

import { useTranslations as useUITranslations } from "next-intl";
import { useRef, useState } from "react";
import type { Problem } from "@/lib/problems-data";
import { DIFFICULTY_POINTS } from "@/lib/problems-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IconUpload, IconSpinner, IconAlertTriangle, IconCheckCircle } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase';

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ProblemModal({
  problem,
  open,
  onOpenChange,
  onSolved,
  uid,
}: {
  problem: Problem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSolved: (problemId: string) => void;
  uid: string | null;
}) {
  const ui = useUITranslations("ui");
  const { toast } = useToast();
  const [answer, setAnswer] = useState("");
  const [solution, setSolution] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [state, setState] = useState<SubmitState>("idle");
  const [explanation, setExplanation] = useState('');
  const [correct, setCorrect] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!problem) return null;

  const reset = () => {
    setAnswer("");
    setSolution("");
    setImageFile(null);
    setImagePreview(null);
    setState("idle");
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!uid) {
      toast({ title: ui("signInRequired"), description: ui("signInToSubmitASolution"), variant: "destructive" });
      return;
    }
    if (!answer.trim()) return;

    setState("submitting");
    try {
      let imageUrl = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const upRes = await fetch("/api/upload/avatar", { method: "POST", body: formData });
        if (upRes.ok) {
          const data = await upRes.json();
          imageUrl = data.url as string;
        }
      }

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` },
        body: JSON.stringify({
          uid,
          problemId: problem.id,
          platform: "internal",
          answer,
          solution: problem.type === "text" ? answer : solution,
          imageUrl,
        }),
      });

      if (!res.ok) throw new Error("submission failed");

      const result = await res.json();
      setCorrect(result.correct); setExplanation(result.explanation);
      setState("success");
      if (result.correct) onSolved(problem.id);
      toast({ title: result.correct ? ui("correctAnswer") : ui("incorrectAnswer") });
    } catch {
      setState("error");
      toast({ title: ui("error"), description: ui("couldNotSubmitSolution"), variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setState("idle") : handleClose())}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {ui("problem")} </span>
            <span className="rounded-full border border-sky/30 bg-sky/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-sky">
              {problem.difficulty === "easy" ? ui("basic") : problem.difficulty === "medium" ? ui("intermediate") : ui("olympiad")}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              +{DIFFICULTY_POINTS[problem.difficulty]} XP
            </span>
          </div>
          <DialogTitle className="font-headline text-2xl font-bold tracking-tight">
            {problem.title}
          </DialogTitle>
          <DialogDescription className="mt-2 leading-relaxed text-muted-foreground">
            {problem.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {state === "success" ? (
            <div className="flex items-center gap-3 rounded-2xl border border-mint/30 bg-mint/10 p-5">
              <IconCheckCircle className="h-8 w-8 shrink-0 text-mint" />
              <div>
                <p className="font-semibold">{correct ? ui('correct') : ui('incorrect')}</p>
                <p className="text-sm text-muted-foreground">{explanation}</p>
              </div>
            </div>
          ) : state === "error" ? (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
              <IconAlertTriangle className="h-8 w-8 shrink-0 text-red-400" />
              <div>
                <p className="font-semibold text-red-400">{ui("couldNotSubmit")}</p>
                <p className="text-sm text-muted-foreground">{ui("pleaseTryAgain")}</p>
              </div>
            </div>
          ) : (
            <>
              {problem.type === "choice" && problem.options ? (
                <div className="space-y-3">
                  <Label>{ui("chooseAnAnswer")}</Label>
                  <RadioGroup value={answer} onValueChange={setAnswer} className="gap-2">
                    {problem.options.map((option) => (
                      <div
                        key={option}
                        className="flex items-center gap-3 rounded-xl border border-border bg-panel/40 p-3 transition-colors has-[:checked]:border-cyan/60 has-[:checked]:bg-cyan/5"
                      >
                        <RadioGroupItem value={option} id={`opt-${option}`} />
                        <Label htmlFor={`opt-${option}`} className="flex-1 cursor-pointer text-sm font-medium">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="answer">{ui("yourAnswer")}</Label>
                  <Textarea
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={ui("writeYourSolution")}
                    rows={4}
                  />
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="solution">{ui("explanationOptional")}</Label>
                <Textarea
                  id="solution"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder={ui("describeYourReasoning")}
                  rows={2}
                />
              </div>

              <div>
                <Label>{ui("imageOptional")}</Label>
                <div
                  onClick={() => fileRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
                  className="mt-2 cursor-pointer rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:border-cyan/40"
                >
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagePreview} alt={ui("uploadedSolutionPreview")} className="mx-auto max-h-48 rounded-lg" />
                  ) : (
                    <span className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                      <IconUpload className="h-7 w-7" />
                      {ui("clickToAttachAPhotoOfYourSolution")}
                    </span>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={state === "submitting" || !answer.trim()}
                variant="gradient"
                size="lg"
                className="w-full"
                aria-busy={state === "submitting"}
              >
                {state === "submitting" ? (
                  <>
                    <IconSpinner className="mr-2 h-4 w-4 animate-spin" />
                    {ui("submitting")}
                  </>
                ) : (
                  ui("checkAnswer")
                )}
              </Button>
            </>
          )}

          {(state === "success" || state === "error") && (
            <Button variant="outline" onClick={handleClose} className="w-full">
              {ui("close")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
