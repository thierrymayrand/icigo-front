import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Image } from "lucide-react"

interface AddProviderProps {
  onBack: () => void;
  onAdd: (provider: Provider) => void;
}

export function AddProvider({ onBack, onAdd }: AddProviderProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const response = await fetch('/api/prestataire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.get('name'),
          email: formData.get('email'),
          telephone: formData.get('phone'),
          nomSociete: formData.get('company'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create provider');
      }

      const newProvider = await response.json();
      onAdd(newProvider);
    } catch (error) {
      console.error('Error creating provider:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Prestataires</span>
          <span className="text-muted-foreground">/</span>
          <span>Jimmy Deschamps</span>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Profile section */}
        <div className="flex items-center gap-6 mb-12">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <Image className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold">Jimmy Deschamps</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-6">Coordonnés</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Nom complet
                  </label>
                  <Input name="name" />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Téléphone
                  </label>
                  <div className="flex gap-2">
                    <Input className="w-16" defaultValue="+" />
                    <Input name="phone" className="flex-1" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Email
                  </label>
                  <Input name="email" type="email" />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Nom de la société
                  </label>
                  <Input name="company" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                Ajouter le prestataire
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 