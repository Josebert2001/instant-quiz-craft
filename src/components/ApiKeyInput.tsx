
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem('groqApiKey');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('groqApiKey', apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your Groq API key has been saved in your browser"
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8 space-y-4">
      <div className="flex gap-2">
        <Input
          type="password"
          placeholder="Enter your Groq API key..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Button onClick={handleSave}>Save Key</Button>
      </div>
      <p className="text-sm text-gray-500">
        Your API key will be stored locally in your browser.
      </p>
    </div>
  );
};
