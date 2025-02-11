import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Plus, Trash } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

interface Step {
  number: number;
  title: string;
}

const steps: Step[] = [
  { number: 1, title: "Généralités" },
  { number: 2, title: "Programmes" },
  { number: 3, title: "Participants" },
  { number: 4, title: "Prix" },
];

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  isEnabled: boolean;
  timeSlots: TimeSlot[];
}

interface CreateActivityRequest {
  nom: string;
  code: string;
  paiementTotalExigee: boolean;
}

interface NewActivityProps {
  onCancel: () => void;
  onSubmit: (activity: {
    id: string;
    nom: string;
    type: string;
    prestataire: string;
    lieuActivite: string;
    lieuDepart: string;
    duree: string;
  }) => void;
}

export function NewActivity({ onCancel, onSubmit }: NewActivityProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [activityType, setActivityType] = useState<string>("");
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({
    Dim: { isEnabled: false, timeSlots: [] },
    Lun: { isEnabled: true, timeSlots: [{ startTime: "10:00", endTime: "16:00" }] },
    Mar: { isEnabled: true, timeSlots: [{ startTime: "10:00", endTime: "16:00" }] },
    Mer: { isEnabled: true, timeSlots: [{ startTime: "10:00", endTime: "16:00" }] },
    Jeu: { isEnabled: true, timeSlots: [{ startTime: "10:00", endTime: "16:00" }] },
    Ven: { isEnabled: true, timeSlots: [{ startTime: "10:00", endTime: "16:00" }] },
    Sam: { isEnabled: false, timeSlots: [] },
  });
  const [formData, setFormData] = useState({
    nom: "",
    code: "",
    paiementTotalExigee: false,
  });

  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const handleTimeSlotChange = (day: string, slotIndex: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, i) => 
          i === slotIndex ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  const addTimeSlot = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, { startTime: "10:00", endTime: "16:00" }],
      },
    }));
  };

  const removeTimeSlot = (day: string, slotIndex: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_, i) => i !== slotIndex),
      },
    }));
  };

  const copyScheduleToAll = (sourceDay: string) => {
    const sourceDaySchedule = schedule[sourceDay];
    setSchedule(prev => {
      const newSchedule = { ...prev };
      Object.keys(newSchedule).forEach(day => {
        if (day !== sourceDay && newSchedule[day].isEnabled) {
          newSchedule[day] = {
            ...newSchedule[day],
            timeSlots: [...sourceDaySchedule.timeSlots],
          };
        }
      });
      return newSchedule;
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/activitees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nom: formData.nom,
          code: formData.code || formData.nom.toLowerCase().replace(/\s+/g, '-'),
          paiementTotalExigee: formData.paiementTotalExigee,
        } as CreateActivityRequest),
      });

      if (!response.ok) {
        throw new Error('Failed to create activity');
      }

      const data = await response.json();
      onSubmit({
        id: data.id,
        nom: formData.nom,
        code: formData.code || formData.nom.toLowerCase().replace(/\s+/g, '-'),
        type: "Default Type",
        prestataire: "Default Provider",
        lieuActivite: "Default Location",
        lieuDepart: "Default Departure",
        duree: "Default Duration",
        paiementTotalExigee: formData.paiementTotalExigee,
      });
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <h2 className="text-lg font-medium">Étape 1 : Ajouter les détails de l'activité</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Nom de l'activité
                </label>
                <Input 
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Excursion à Petite Terre, Plongée à la réserve cousteau, etc"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">
                  Code
                </label>
                <Input 
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  placeholder="Le code sera généré automatiquement si laissé vide"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="paiementTotal"
                  checked={formData.paiementTotalExigee}
                  onCheckedChange={(checked) => 
                    handleInputChange('paiementTotalExigee', checked as boolean)
                  }
                />
                <label 
                  htmlFor="paiementTotal" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Exiger le paiement total
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <h2 className="text-lg font-medium">Étape 2 : Créer votre programme principal</h2>
            <div>
              <h3 className="text-base font-medium mb-4">Horaire Hebdomadaire</h3>
              <div className="space-y-6">
                {Object.entries(schedule).map(([day, { isEnabled, timeSlots }]) => (
                  <div key={day} className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Switch 
                        checked={isEnabled}
                        onCheckedChange={(checked) => {
                          setSchedule(prev => ({
                            ...prev,
                            [day]: {
                              isEnabled: checked,
                              timeSlots: checked ? [{ startTime: "10:00", endTime: "16:00" }] : [],
                            },
                          }));
                        }}
                      />
                      <Label className="w-12 font-medium">{day}</Label>
                      {!isEnabled ? (
                        <span className="text-muted-foreground">Indisponible</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyScheduleToAll(day)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {isEnabled && (
                      <div className="ml-16 space-y-3">
                        {timeSlots.map((slot, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Select
                              value={slot.startTime}
                              onValueChange={(value) => handleTimeSlotChange(day, index, 'startTime', value)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span>-</span>
                            <Select
                              value={slot.endTime}
                              onValueChange={(value) => handleTimeSlotChange(day, index, 'endTime', value)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="space-x-2">
                              {timeSlots.length > 1 && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeTimeSlot(day, index)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              )}
                              {index === timeSlots.length - 1 && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => addTimeSlot(day)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <h2 className="text-lg font-medium">
              Étape 3 : Ajouter le nombre minimal et maximal de personnes pour l'excursion
            </h2>
            <div className="space-y-6">
              {['Total', 'Adultes', 'Enfants', 'Nourrissons'].map((category) => (
                <div key={category} className="flex items-center gap-8">
                  <span className="w-24 font-medium">{category}</span>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground mr-2">Max</span>
                      <Select defaultValue="0">
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(21)].map((_, i) => (
                            <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground mr-2">Min</span>
                      <Select defaultValue="0">
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(21)].map((_, i) => (
                            <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <h2 className="text-lg font-medium">Étape 4 : Ajouter le prix par participants</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm font-medium">Prix par adulte</label>
                <div className="flex items-center gap-2">
                  <Input type="number" className="w-32" />
                  <span>€</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm font-medium">Prix par enfant</label>
                <div className="flex items-center gap-2">
                  <Input type="number" className="w-32" />
                  <span>€</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-semibold">Nouvelle Activité</h1>
          <div className="space-x-4">
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button 
              onClick={() => {
                if (currentStep < 4) {
                  setCurrentStep(currentStep + 1);
                } else {
                  handleSubmit();
                }
              }}
            >
              {currentStep === 4 ? "Terminer" : "Continuer"}
            </Button>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex gap-4 mb-12">
          {steps.map((step) => (
            <div 
              key={step.number}
              className={`flex items-center gap-3 ${
                currentStep === step.number ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              <div className={`
                w-8 h-8 rounded-full border flex items-center justify-center
                ${currentStep === step.number ? 'border-primary bg-primary text-white' : ''}
              `}>
                {step.number}
              </div>
              <span>{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step content */}
        {renderStepContent()}
      </div>
    </div>
  );
} 