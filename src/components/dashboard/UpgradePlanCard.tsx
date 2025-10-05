import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export function UpgradePlanCard() {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <Badge variant="default" className="text-xs">
                Free Plan
              </Badge>
            </div>
            <h3 className="font-semibold text-lg mb-1">Unlock More Power</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upgrade to Pro for unlimited workflows, advanced analytics, and priority support
            </p>
            <Button
              onClick={() => navigate("/pricing")}
              className="group"
            >
              Upgrade Plan
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
