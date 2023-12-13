import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        <h1 className="text-3xl font-semibold text-center">
          HI
        </h1>
        <Button>Hello world!</Button>
      </div>
    </div>
  );
}