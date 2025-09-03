import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Zap, Bot, Rocket, ArrowRight, Sparkles, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Landing() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [workflowPrompt, setWorkflowPrompt] = useState("");
  const [workflowResult, setWorkflowResult] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [faqQuery, setFaqQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const faqResults = useQuery(
    api.faqs.searchFAQs,
    committedQuery ? { searchTerm: committedQuery } : "skip"
  ) ?? [];
  
  const generateWorkflowJSON = useAction(api.workflowActions.generateWorkflowJSON);

  const handleGenerateWorkflow = async () => {
    if (!workflowPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const result = await generateWorkflowJSON({ prompt: workflowPrompt });
      setWorkflowResult(result);
      toast("Workflow generated successfully! 🚀");
    } catch (error) {
      toast("Failed to generate workflow. Please try again.");
    }
    setIsGenerating(false);
  };

  const handleFAQSearch = async () => {
    if (!faqQuery.trim()) return;
    setCommittedQuery(faqQuery);
  };

  return (
    <div className="min-h-screen bg-[#4D181C]">
      {/* Neo Brutalist Header */}
      <header className="bg-[#144058] border-b-4 border-black p-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.h1 
            className="text-4xl font-black text-black cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            LETHIMDO
          </motion.h1>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#workflows" className="text-black font-black hover:text-[#E58D2E] transition-colors border-4 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000000] hover:bg-[#4D181C]">
              WORKFLOWS
            </a>
            <a href="#faq" className="text-black font-black hover:text-[#E58D2E] transition-colors border-4 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000000] hover:bg-[#4D181C]">
              FAQ
            </a>
            <Button 
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="bg-black text-[#E58D2E] border-4 border-black font-black hover:bg-[#144058] hover:text-black shadow-[4px_4px_0px_#000000]"
            >
              {isAuthenticated ? "DASHBOARD" : "GET STARTED"}
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h1 className="text-6xl md:text-8xl font-black text-black mb-6 leading-tight">
              BUILD AI
              <br />
              <span className="bg-[#E58D2E] px-4 py-2 inline-block transform -rotate-2 shadow-[8px_8px_0px_#000000]">
                WORKFLOWS
              </span>
              <br />
              INSTANTLY
            </h1>
            <p className="text-2xl font-bold text-black max-w-3xl mx-auto mb-8">
              Plug-and-play AI automation for your business. 
              Describe what you want in plain English, get working automation in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="bg-[#E58D2E] text-black border-4 border-black font-black text-xl px-8 py-4 shadow-[8px_8px_0px_#000000] hover:bg-[#144058] transform hover:scale-105 transition-all"
              >
                <Rocket className="mr-2 h-6 w-6" />
                START BUILDING
              </Button>
              <Button 
                variant="outline"
                onClick={() => document.getElementById('workflows')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-4 border-black font-black text-xl px-8 py-4 shadow-[8px_8px_0px_#000000] hover:bg-black hover:text-[#DD671E]"
              >
                SEE HOW IT WORKS
              </Button>
            </div>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { icon: Zap, title: "LIGHTNING FAST", desc: "Generate workflows in seconds, not hours" },
              { icon: Bot, title: "AI POWERED", desc: "Natural language to automation magic" },
              { icon: Sparkles, title: "NO CODE", desc: "Build complex workflows without coding" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000] transition-all transform hover:-translate-y-2">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-black mx-auto mb-4" />
                    <CardTitle className="text-black font-black text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-black font-bold">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Workflow Builder Section */}
      <section id="workflows" className="py-20 px-6 bg-[#DD671E]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-black text-black mb-6">
              AI WORKFLOW BUILDER
            </h2>
            <p className="text-xl font-bold text-black max-w-3xl mx-auto">
              Describe your automation needs in plain English and watch our AI generate the perfect workflow for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Workflow Generator */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-[#E58D2E] border-4 border-black shadow-[8px_8px_0px_#000000] h-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-black flex items-center gap-2">
                    <Bot className="h-8 w-8" />
                    DESCRIBE YOUR WORKFLOW
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={workflowPrompt}
                    onChange={(e) => setWorkflowPrompt(e.target.value)}
                    placeholder="Example: Send a welcome email when someone signs up on my website..."
                    className="border-4 border-black font-bold min-h[120px] resize-none"
                  />
                  <Button 
                    onClick={handleGenerateWorkflow}
                    disabled={isGenerating || !workflowPrompt.trim()}
                    className="w-full bg-[#144058] text-black border-4 border-black font-black text-lg py-3 shadow-[4px_4px_0px_#000000] hover:bg-[#DD671E] disabled:opacity-50"
                  >
                    {isGenerating ? "GENERATING..." : "GENERATE WORKFLOW"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  {workflowResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-white border-4 border-black shadow-[4px_4px_0px_#000000]"
                    >
                      <h4 className="font-black text-black mb-2">GENERATED WORKFLOW:</h4>
                      <p className="font-bold text-black mb-2">{workflowResult.title}</p>
                      <pre className="text-xs bg-black text-[#00FF80] p-2 overflow-x-auto font-mono border-4 border-black shadow-[4px_4px_0px_#000000]">
                        {JSON.stringify(workflowResult.workflowJSON, null, 2)}
                      </pre>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Example Workflows */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-black text-black mb-6">POPULAR WORKFLOWS</h3>
              
              {[
                {
                  title: "WELCOME EMAIL AUTOMATION",
                  desc: "Automatically send personalized welcome emails to new subscribers",
                  category: "EMAIL",
                  color: "bg-[#144058]"
                },
                {
                  title: "DAILY SALES REPORT",
                  desc: "Generate and send daily sales reports to your team automatically",
                  category: "REPORTING",
                  color: "bg-[#4D181C]"
                },
                {
                  title: "LEAD FOLLOW-UP SEQUENCE",
                  desc: "Nurture leads with automated follow-up messages and content",
                  category: "MARKETING",
                  color: "bg-white"
                },
                {
                  title: "SOCIAL MEDIA POSTING",
                  desc: "Schedule and post content across multiple social platforms",
                  category: "SOCIAL",
                  color: "bg-[#DD671E]"
                }
              ].map((workflow, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`${workflow.color} border-4 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[8px_8px_0px_#000000] transition-all cursor-pointer transform hover:-translate-y-1`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-black font-black text-lg">{workflow.title}</CardTitle>
                        <Badge className="bg-black text-white font-black border-2 border-black">
                          {workflow.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-black font-bold text-sm">{workflow.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Chatbot Section */}
      <section id="faq" className="py-20 px-6 bg-[#144058]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-black text-black mb-6">
              FAQ CHATBOT
            </h2>
            <p className="text-xl font-bold text-black">
              Ask questions and get instant AI-powered answers from our knowledge base.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_#000000]">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-black flex items-center gap-2">
                  <MessageCircle className="h-8 w-8" />
                  ASK ANYTHING
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={faqQuery}
                    onChange={(e) => setFaqQuery(e.target.value)}
                    placeholder="What is Lethimdo? How do I create workflows?"
                    className="border-4 border-black font-bold flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleFAQSearch()}
                  />
                  <Button 
                    onClick={handleFAQSearch}
                    className="bg-[#E58D2E] text-black border-4 border-black font-black shadow-[4px_4px_0px_#000000] hover:bg-[#DD671E]"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>

                {faqResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 mt-6"
                  >
                    <h4 className="font-black text-black text-lg">SEARCH RESULTS:</h4>
                    {faqResults.map((faq, index) => (
                      <div key={index} className="p-4 bg-[#DD671E] border-4 border-black shadow-[4px_4px_0px_#000000] transform transition-transform hover:-translate-y-1">
                        <h5 className="font-black text-black mb-2">{faq.question}</h5>
                        <p className="font-bold text-black text-sm">{faq.answer}</p>
                        <Badge className="bg-[#E58D2E] text-black font-black border-2 border-black mt-2">
                          {faq.category}
                        </Badge>
                      </div>
                    ))}
                  </motion.div>
                )}

                {faqQuery && faqResults.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-black font-bold">No results found. Try a different question!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#4D181C]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-black text-[#E58D2E] mb-6">
              READY TO AUTOMATE?
            </h2>
            <p className="text-xl font-bold text-white mb-8">
              Join thousands of businesses already using Lethimdo to automate their workflows.
            </p>
            <Button 
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="bg-[#E58D2E] text-black border-4 border-white font-black text-2xl px-12 py-6 shadow-[8px_8px_0px_#144058] hover:bg-[#144058] transform hover:scale-105 transition-all"
            >
              <Rocket className="mr-3 h-8 w-8" />
              {isAuthenticated ? "GO TO DASHBOARD" : "START FREE TODAY"}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#144058] border-t-4 border-black py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-black font-black text-lg">
            POWERED BY{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#E58D2E] transition-colors"
            >
              VLY.AI
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}