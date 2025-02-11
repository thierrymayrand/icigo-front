import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Filter } from "lucide-react"
import { useState, useEffect } from "react"
import { NewActivity } from "./NewActivity"
import { ActivityDetails } from "./ActivityDetails"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { X } from "lucide-react"

interface TicketConfiguration {
  nomTicket: string;
  prixDeBase: number;
  valeurCommission: number;
  commissionEnPourcentage: boolean;
  capaciteeMax: number;
}

interface Activity {
  id: string;
  nom: string;
  code: string;
  paiementTotalExigee: boolean;
  prestataire: string;
  type: string;
  lieuActivite: string;
  lieuDepart: string;
  duree: string;
  ticketConfigurations: TicketConfiguration[];
  saisons: any[];
  periodesIndisponibles: any[];
}

interface ActivityFilters {
  name: string;
  code: string;
  type: string;
  location: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ActivityFilters>({
    name: "",
    code: "",
    type: "",
    location: "",
  });

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/activitees`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      const data = await response.json();
      // Extract activities array from the response
      const activitiesData = data.activitees || [];
      // Map API data to our Activity interface
      const mappedData = activitiesData.map((item: any) => ({
        id: item.id,
        nom: item.nom,
        code: item.code,
        paiementTotalExigee: item.paiementTotalExigee,
        prestataire: item.prestataire || "Default Provider",
        type: item.type || "Default Type",
        lieuActivite: item.lieuActivite || "Default Location",
        lieuDepart: item.lieuDepart || "Default Departure",
        duree: item.duree || "Default Duration",
        ticketConfigurations: item.ticketConfigurations || [],
        saisons: item.saisons || [],
        periodesIndisponibles: item.periodesIndisponibles || []
      }));
      setActivities(mappedData);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleAddActivity = async (newActivity: Activity) => {
    await fetchActivities(); // Refresh the list after adding
    setIsCreating(false);
  };

  // Filter and search logic
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.lieuActivite.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.lieuDepart.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      (!filters.name || activity.nom.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.code || activity.code.toLowerCase().includes(filters.code.toLowerCase())) &&
      (!filters.type || activity.type.toLowerCase().includes(filters.type.toLowerCase())) &&
      (!filters.location || 
        activity.lieuActivite.toLowerCase().includes(filters.location.toLowerCase()) ||
        activity.lieuDepart.toLowerCase().includes(filters.location.toLowerCase()));

    return matchesSearch && matchesFilters;
  });

  const handleFilterSubmit = (newFilters: ActivityFilters) => {
    setFilters(newFilters);
  };

  if (isCreating) {
    return (
      <NewActivity 
        onCancel={() => setIsCreating(false)}
        onSubmit={handleAddActivity}
      />
    );
  }

  if (selectedActivity) {
    return (
      <ActivityDetails 
        activity={selectedActivity}
        onBack={() => setSelectedActivity(null)}
      />
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Activités</h1>
        <Button onClick={() => setIsCreating(true)}>
          Nouvelle activité
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-full"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtres
              {Object.values(filters).some(Boolean) && (
                <span className="ml-2 h-2 w-2 rounded-full bg-primary"></span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px]">
            <SheetHeader className="flex flex-row justify-between items-center border-b pb-4">
              <SheetTitle>Filtres</SheetTitle>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </SheetHeader>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleFilterSubmit({
                  name: formData.get('filter-name') as string,
                  code: formData.get('filter-code') as string,
                  type: formData.get('filter-type') as string,
                  location: formData.get('filter-location') as string,
                });
              }}
              className="space-y-6 py-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom</label>
                <Input 
                  name="filter-name"
                  defaultValue={filters.name}
                  type="text" 
                  placeholder="Nom de l'activité" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Code</label>
                <Input 
                  name="filter-code"
                  defaultValue={filters.code}
                  type="text" 
                  placeholder="Code" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Input 
                  name="filter-type"
                  defaultValue={filters.type}
                  type="text" 
                  placeholder="Type d'activité" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Lieu</label>
                <Input 
                  name="filter-location"
                  defaultValue={filters.location}
                  type="text" 
                  placeholder="Lieu de l'activité ou de départ" 
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      name: "",
                      code: "",
                      type: "",
                      location: "",
                    });
                  }}
                >
                  Reset
                </Button>
                <SheetTrigger asChild>
                  <Button type="submit">
                    Appliquer les filtres
                  </Button>
                </SheetTrigger>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prestataire</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Lieu de l'activité</TableHead>
              <TableHead>Lieu de départ</TableHead>
              <TableHead>Durée</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No activities found
                </TableCell>
              </TableRow>
            ) : (
              filteredActivities.map((activity, index) => (
                <TableRow 
                  key={activity.id || index}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <TableCell>{activity.code}</TableCell>
                  <TableCell>{activity.nom}</TableCell>
                  <TableCell>{activity.prestataire}</TableCell>
                  <TableCell>{activity.type}</TableCell>
                  <TableCell>{activity.lieuActivite}</TableCell>
                  <TableCell>{activity.lieuDepart}</TableCell>
                  <TableCell>{activity.duree}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 