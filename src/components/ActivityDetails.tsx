import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface ActivityDetailsProps {
  activity: {
    code: string;
    nom: string;
    prestataire: string;
    type: string;
    lieuActivite: string;
    lieuDepart: string;
    duree: string;
  };
  onBack: () => void;
}

export function ActivityDetails({ activity, onBack }: ActivityDetailsProps) {
  const [activeTab, setActiveTab] = useState("generalites")

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Activités</span>
          <span className="text-muted-foreground">/</span>
          <span>{activity.nom}</span>
        </div>
      </div>

      <div className="max-w-5xl">
        <h1 className="text-2xl font-semibold mb-8">{activity.nom}</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="space-x-4 bg-transparent">
            <TabsTrigger 
              value="generalites"
              className={`rounded-none border-b-2 ${
                activeTab === "generalites" 
                  ? "border-primary" 
                  : "border-transparent"
              }`}
            >
              Généralités
            </TabsTrigger>
            <TabsTrigger 
              value="programmes"
              className={`rounded-none border-b-2 ${
                activeTab === "programmes" 
                  ? "border-primary" 
                  : "border-transparent"
              }`}
            >
              Programmes
            </TabsTrigger>
            <TabsTrigger 
              value="participants"
              className={`rounded-none border-b-2 ${
                activeTab === "participants" 
                  ? "border-primary" 
                  : "border-transparent"
              }`}
            >
              Participants
            </TabsTrigger>
            <TabsTrigger 
              value="prix"
              className={`rounded-none border-b-2 ${
                activeTab === "prix" 
                  ? "border-primary" 
                  : "border-transparent"
              }`}
            >
              Prix
            </TabsTrigger>
            <TabsTrigger 
              value="paiement"
              className={`rounded-none border-b-2 ${
                activeTab === "paiement" 
                  ? "border-primary" 
                  : "border-transparent"
              }`}
            >
              Paiement et acompte
            </TabsTrigger>
            <TabsTrigger 
              value="accepter"
              className={`rounded-none border-b-2 ${
                activeTab === "accepter" 
                  ? "border-primary" 
                  : "border-transparent"
              }`}
            >
              Accepter/Refuser
            </TabsTrigger>
            <TabsTrigger 
              value="options"
              className={`rounded-none border-b-2 ${
                activeTab === "options" 
                  ? "border-primary" 
                  : "border-transparent"
              }`}
            >
              Options
            </TabsTrigger>
            <TabsTrigger 
              value="messages"
              className={`rounded-none border-b-2 ${
                activeTab === "messages" 
                  ? "border-primary" 
                  : "border-transparent"
              }`}
            >
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="programmes" className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Programme actuel</h3>
              <div className="grid grid-cols-7 gap-4">
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day) => (
                  <div key={day} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{day}</h4>
                    <div className="space-y-2 text-sm">
                      <div>10:00am - 12:00pm</div>
                      <div>12:00pm - 03:00pm</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Nombre de participants par activité</h3>
              <div className="space-y-4">
                {['Total', 'Adultes', 'Enfants (9-15 ans)', 'Enfants (2-8 ans)', 'Nourrissons (-2 ans)'].map((category) => (
                  <div key={category} className="flex items-center gap-8">
                    <span className="w-48">{category}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Max: 12</span>
                      <span className="text-sm text-muted-foreground">Min: 2</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Prix Tab */}
          <TabsContent value="prix" className="space-y-8">
            <div>
              <h3 className="font-medium mb-4">Prix</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de prix</label>
                  <Select defaultValue="par-personne">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type de prix" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="par-personne">Par personne</SelectItem>
                      <SelectItem value="par-groupe">Par groupe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm font-medium">Adultes</label>
                    <div className="flex items-center gap-2">
                      <Input type="number" className="w-32" />
                      <span>€</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm font-medium">Enfants (9-15)</label>
                    <div className="flex items-center gap-2">
                      <Input type="number" className="w-32" />
                      <span>€</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm font-medium">Enfants (2-8)</label>
                    <div className="flex items-center gap-2">
                      <Input type="number" className="w-32" />
                      <span>€</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 text-sm font-medium">Nourrissons</label>
                    <div className="flex items-center gap-2">
                      <Input type="number" className="w-32" />
                      <span>€</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Prix spéciaux</h3>
              <Button variant="outline">Nouveau prix spécial</Button>
            </div>
          </TabsContent>

          {/* Paiement Tab */}
          <TabsContent value="paiement" className="space-y-8">
            <div className="max-w-md space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Paiement et acompte</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Paiement en ligne</label>
                    <Select defaultValue="exiger">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exiger">Exiger le paiement d'un acompte</SelectItem>
                        <SelectItem value="optionnel">Paiement optionnel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Acompte</label>
                    <div className="flex items-center gap-2">
                      <Input type="number" className="w-20" defaultValue="15" />
                      <span>%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Frais d'annulation</h3>
                <Button variant="outline">Nouveaux frais</Button>
              </div>
            </div>
          </TabsContent>

          {/* Accepter/Refuser Tab */}
          <TabsContent value="accepter" className="space-y-8">
            <div className="max-w-md space-y-6">
              <div className="flex items-start gap-2">
                <Checkbox id="auto-accept" />
                <label htmlFor="auto-accept" className="text-sm">
                  Je veux pouvoir accepter ou refuser toute réservation pour cette excursion
                </label>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Paiement après acceptation</h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Une fois qu'une réservation est acceptée, le client est prévenu qu'il doit payer au plus tard:
                  </p>
                  <div className="flex items-center gap-2">
                    <Input type="number" className="w-20" defaultValue="3" />
                    <Select defaultValue="jours">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="heures">heures</SelectItem>
                        <SelectItem value="jours">jours</SelectItem>
                        <SelectItem value="semaines">semaines</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>avant</span>
                    <Select defaultValue="debut">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debut">le début de l'activité</SelectItem>
                        <SelectItem value="fin">la fin de l'activité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Si le client ne paie pas dans les délais prévus...</p>
                <Select defaultValue="annuler">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annuler">annuler la réservation</SelectItem>
                    <SelectItem value="maintenir">maintenir la réservation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Options Tab */}
          <TabsContent value="options" className="space-y-8">
            <div className="max-w-md">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Île de la Désirade</span>
                      <Button variant="outline" size="sm">Ajouter</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span>Vile de Saint-François</span>
                      <Button variant="outline" size="sm">Ajouter</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span>Confirmation à l'oral de votre réservation</span>
                      <Button variant="outline" size="sm">Ajouter</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 