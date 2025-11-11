import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, TrendingUp, History } from "lucide-react";

export function NoMarkets() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 p-8 text-center">
      <Package className="h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No events found</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Get started by creating the first fundraising prediction event on Devnet.
      </p>
      <Button
        onClick={() => navigate("/create")}
        className="mt-6"
        variant="default"
      >
        Create Event
      </Button>
    </div>
  );
}

export function NoPositions() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 p-8 text-center">
      <TrendingUp className="h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">
        You haven't placed any bets yet
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Start betting on fundraising events to see your positions here.
      </p>
      <Button
        onClick={() => navigate("/")}
        className="mt-6"
        variant="default"
      >
        Explore Events
      </Button>
    </div>
  );
}

export function NoTransactions() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 p-8 text-center">
      <History className="h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">
        Your bets will appear here
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Once you place bets, they will show up in your transaction history.
      </p>
    </div>
  );
}
