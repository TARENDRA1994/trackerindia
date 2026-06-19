import MedicalAdvisory from "@/components/MedicalAdvisory";

export default function MedicalPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">Administrative Medical Advisory</h1>
        <p className="text-muted-foreground">Monitoring the health of candidates during intensive preparation.</p>
      </div>
      
      <MedicalAdvisory />
    </div>
  );
}
