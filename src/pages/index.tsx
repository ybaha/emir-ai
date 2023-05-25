import { type NextPage } from "next";
import { api } from "../utils/api";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import React from "react";
import Avatar from "../components/ui/avatar";
import Meta from "@/src/utils/meta";
import locale from "@/src/i18n.json" assert { type: "json" };
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { useSettings } from "../stores/settings";

const Home: NextPage = () => {
  const [responses, setResponses] = React.useState<string[]>([]);
  const [prompts, setPrompts] = React.useState<string[]>([]);
  const [thinking, setThinking] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [error, setError] = React.useState(false);

  const { language, setLanguage } = useSettings();

  // TODO: use a proper i18n solution :P
  const t = (str: keyof typeof locale.en) => {
    return locale[language as "tr" | "en"][str];
  };

  const chatWindowRef = React.useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    if (!prompt.length || prompt === "\n") return setPrompt("");
    if (thinking) return;

    handleSend.mutate({ text: prompt, prompts, responses, language });
    setPrompts((prev) => [...prev, prompt]);
    setPrompt("");
  };

  const handleSend = api.gpt.sendMessage.useMutation({
    onMutate: (message) => {
      setThinking(true);
    },
    onSuccess: (data) => {
      setError(false);
      setResponses((prev) => [...prev, data.choices[0]?.message?.content || "Error"]);
      setThinking(false);
    },
    onError: (error) => {
      setThinking(false);
      setError(true);
      setResponses((prev) => [...prev, t("error")]);
      console.log({ error });
    },
  });

  const onKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = "";
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;

    if (!e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      handleButtonClick();
      e.currentTarget.style.height = "0";
    }
  };

  React.useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [prompts, responses]);

  return (
    <>
      <Meta
        title="Emir Mustafa Demir AI - The Aggressive Lover of League of Legends and Turkish Politics"
        description="Meet Emir Mustafa Demir, a character AI who is always aggressive and passionate about love, League of Legends, and Turkish politics. He supports the Memleket Partisi. Talk to him about these topics and watch his emotions run wild. He also loves talking to his best friends Baha, Ahmet, Alp, and Yusha, but beware of his fiery temper and profanity-laden insults. Interact with Emir Mustafa Demir AI and experience a unique and entertaining conversation."
        image="/emir.jpeg"
        url="https://emirmustafademirai.lol"
      />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 p-2">
        <section className="container grid max-w-[640px] gap-4">
          <div className="flex">
            <div className="flex items-center">
              <Avatar
                src="/emir.jpeg"
                className={
                  thinking
                    ? "h-12 w-12 animate-spin rounded-full duration-300"
                    : "h-12 w-12 rounded-full"
                }
              ></Avatar>
              <h1 className="ml-4 text-xl font-bold text-white sm:text-4xl">
                {thinking ? t("emir-thinking") : "Emir Mustafa Demir AI"}
              </h1>
            </div>
            <div className="flex flex-1 items-center justify-end">
              <AlertDialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">⚙️</Button>
                </AlertDialogTrigger>
                <AlertDialogContent
                  onClick={() => setSettingsOpen(false)}
                  className="bg-[#00000087] text-gray-300"
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-left">Settings</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogDescription>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <Select onValueChange={(e) => setLanguage(e as "en" | "tr")}>
                          <SelectTrigger className=" w-[108px] border-slate-700 text-gray-300">
                            <SelectValue
                              placeholder={language === "tr" ? "Türkçe 🇹🇷" : "English 🇬🇧"}
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0000007b] backdrop-blur-sm">
                            <SelectGroup className="text-gray-400">
                              <SelectItem value="tr">Türkçe 🇹🇷</SelectItem>
                              <SelectItem value="en">English 🇬🇧</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div className="relative">
            <div
              ref={chatWindowRef}
              className="relative h-[calc(100vh-200px)] w-full overflow-y-scroll rounded-md border border-slate-200 bg-transparent pb-16 dark:border-slate-700 dark:text-slate-100"
            >
              <div className="max-w-[80%] self-start whitespace-pre-wrap p-4 text-gray-300">
                <div className="rounded-xl rounded-bl-none bg-blue-700 px-4 py-2 text-gray-300">
                  {t("first-message")}
                </div>
              </div>
              {prompts.map((prompt, index) => {
                const isLast = index === prompts.length - 1;
                return (
                  <div key={index} className="flex w-full flex-col">
                    <div
                      key={`p${index}`}
                      className="max-w-[80%] self-end whitespace-pre-wrap p-4 text-white"
                    >
                      <div className="rounded-xl rounded-br-none bg-purple-600 px-4 py-2">
                        {prompt}
                      </div>
                    </div>
                    <div
                      key={`r${index}`}
                      className="max-w-[80%] self-start whitespace-pre-wrap p-4 text-gray-300"
                    >
                      <div className="rounded-xl rounded-bl-none bg-blue-700 px-4 py-2 text-gray-300">
                        {isLast && thinking ? (
                          <span>
                            {t("typing")}{" "}
                            <div
                              className="inline-block animate-bounce"
                              style={{ animationDelay: "100ms" }}
                            >
                              .
                            </div>
                            <div
                              className="inline-block animate-bounce"
                              style={{ animationDelay: "200ms" }}
                            >
                              .
                            </div>
                            <div
                              className="inline-block animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            >
                              .
                            </div>
                          </span>
                        ) : (
                          responses[index]
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="absolute bottom-0 left-0 z-10 mx-px mb-px flex w-[calc(100%-2px)] items-end rounded-b-md bg-[#00000081] py-2 backdrop-blur-lg ">
              <Textarea
                className="h-[42px] max-h-[200px]  min-h-[42px] w-full resize-none outline-none focus:border-none focus:outline-none"
                placeholder={t("enter-message")}
                onKeyUp={(e) => onKeyUp(e)}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (e.currentTarget.value === "") e.currentTarget.style.height = "";
                }}
                value={prompt}
              ></Textarea>
              <Button variant="outline" onClick={handleButtonClick} className="mr-2 text-gray-200">
                {t("send")}
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
