import { useState } from "react";
import { EXCHANGES } from "@/src/mock_data";
import { Exchange } from "@/src/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";

export default function Compare() {
  const [selected, setSelected] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const selectedExchanges = EXCHANGES.filter(ex => selected.includes(ex.id));

  if (comparing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Exchange Comparison</h1>
          <Button variant="outline" onClick={() => setComparing(false)}>Back to Select</Button>
        </div>
        <div className="border rounded-xl bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Features</TableHead>
                {selectedExchanges.map(ex => (
                  <TableHead key={ex.id} className="text-center font-bold">
                     <div className="flex flex-col items-center gap-2 mt-2">
                       <img src={ex.logo} alt={ex.name} className="w-8 h-8 rounded" />
                       {ex.name}
                     </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-muted/30">
                <TableCell colSpan={selectedExchanges.length + 1} className="font-semibold text-muted-foreground">About</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Currencies Supported</TableCell>
                {selectedExchanges.map(ex => <TableCell key={ex.id} className="text-center">{ex.currencies}</TableCell>)}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Liquidity</TableCell>
                {selectedExchanges.map(ex => <TableCell key={ex.id} className="text-center">{ex.liquidity}</TableCell>)}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Fee Rates</TableCell>
                {selectedExchanges.map(ex => <TableCell key={ex.id} className="text-center">{ex.fees}</TableCell>)}
              </TableRow>
              <TableRow className="bg-muted/30">
                <TableCell colSpan={selectedExchanges.length + 1} className="font-semibold text-muted-foreground">Capabilities</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Spot Trading</TableCell>
                {selectedExchanges.map(ex => (
                  <TableCell key={ex.id} className="text-center">
                    {ex.features.spot ? <Check className="w-5 h-5 mx-auto text-green-500" /> : <X className="w-5 h-5 mx-auto text-red-500" />}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INR Support</TableCell>
                {selectedExchanges.map(ex => (
                  <TableCell key={ex.id} className="text-center">
                    {ex.features.inr_support ? <Check className="w-5 h-5 mx-auto text-green-500" /> : <X className="w-5 h-5 mx-auto text-red-500" />}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">P2P Trading</TableCell>
                {selectedExchanges.map(ex => (
                  <TableCell key={ex.id} className="text-center">
                    {ex.features.p2p ? <Check className="w-5 h-5 mx-auto text-green-500" /> : <X className="w-5 h-5 mx-auto text-red-500" />}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
           <h1 className="text-2xl font-bold tracking-tight">Compare Exchanges</h1>
           <p className="text-muted-foreground text-sm">Select up to 4 exchanges to compare their features and fees side by side.</p>
        </div>
        <Button onClick={() => setComparing(true)} disabled={selected.length < 2}>Compare Now ({selected.length}/4)</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXCHANGES.map(ex => {
          const isSelected = selected.includes(ex.id);
          return (
            <Card key={ex.id} className={isSelected ? "border-primary ring-1 ring-primary" : ""}>
              <CardHeader className="flex flex-row items-center gap-4">
                <img src={ex.logo} alt={ex.name} className="w-12 h-12 rounded shadow" />
                <div>
                  <CardTitle>{ex.name}</CardTitle>
                  <CardDescription>
                    {ex.features.inr_support && <Badge variant="secondary" className="mr-1">INR Formats</Badge>}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-sm h-16 line-clamp-2">
                {ex.about}
              </CardContent>
              <CardFooter>
                 <Button 
                   variant={isSelected ? "secondary" : "default"} 
                   className="w-full"
                   onClick={() => toggleSelect(ex.id)}
                 >
                   {isSelected ? "Selected" : "Add to Compare"}
                 </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
