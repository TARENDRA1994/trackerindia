import ProductivityTest from "@/components/ProductivityTest";

export default function TestPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">Today's Productivity Exam</h1>
        <p className="text-muted-foreground">AI-generated questions based on UPSC Preliminary standards.</p>
      </div>
      
      <ProductivityTest />
    </div>
  );
}
