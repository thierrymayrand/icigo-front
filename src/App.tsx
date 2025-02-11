import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LayoutGrid, FileText, Users, Calendar, Clock, Filter, X } from "lucide-react"
import { AddProvider } from "@/components/AddProvider"
import { Activities } from "@/components/Activities"
import { Dashboard } from "@/components/Dashboard"

interface Provider {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  nomSociete: string;
}

interface Filters {
  name: string;
  email: string;
  phone: string;
  company: string;
}

type Page = 'dashboard' | 'providers' | 'activities';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    name: "",
    email: "",
    phone: "",
    company: ""
  });
  const [providers, setProviders] = useState<Provider[]>([]);

  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/prestataires`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch providers');
      }
      const data = await response.json();
      // Map API data to our Provider interface
      const mappedData = Array.isArray(data) ? data.map((item: any) => ({
        id: item.id,
        nom: item.nom,
        email: item.email,
        telephone: item.telephone,
        nomSociete: item.nomSociete
      })) : [];
      setProviders(mappedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Move fetchProviders call to useEffect
  useEffect(() => {
    fetchProviders();
  }, []);

  // Filter and search logic
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = 
      provider.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.telephone.includes(searchQuery) ||
      provider.nomSociete.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      (!filters.name || provider.nom.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.email || provider.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (!filters.phone || provider.telephone.includes(filters.phone)) &&
      (!filters.company || provider.nomSociete.toLowerCase().includes(filters.company.toLowerCase()));

    return matchesSearch && matchesFilters;
  });

  const handleFilterSubmit = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleAddProvider = async (newProvider: Provider) => {
    try {
      // After successfully adding the provider
      await fetchProviders(); // Refetch the updated list
      setIsAdding(false);
      setCurrentPage('providers'); // Ensure we're on the providers page
    } catch (error) {
      console.error('Error refreshing providers:', error);
    }
  };

  const renderSidebar = () => (
    <aside className="w-64 border-r border-border bg-card px-6 py-8">
      <div className="h-10 w-10 rounded bg-emerald-400 mb-8"></div>
      
      <nav className="space-y-2">
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage('dashboard');
          }}
          className={`flex items-center px-3 py-2 ${
            currentPage === 'dashboard' 
              ? 'bg-secondary rounded-md text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <LayoutGrid className="mr-3 h-5 w-5" />
          Dashboard
        </a>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage('activities');
          }}
          className={`flex items-center px-3 py-2 ${
            currentPage === 'activities' 
              ? 'bg-secondary rounded-md text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="mr-3 h-5 w-5" />
          Activités
        </a>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage('providers');
          }}
          className={`flex items-center px-3 py-2 ${
            currentPage === 'providers' 
              ? 'bg-secondary rounded-md text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="mr-3 h-5 w-5" />
          Prestataires
        </a>
        <a href="#" className="flex items-center px-3 py-2 text-muted-foreground hover:text-foreground">
          <Calendar className="mr-3 h-5 w-5" />
          Réservations
        </a>
        <a href="#" className="flex items-center px-3 py-2 text-muted-foreground hover:text-foreground">
          <FileText className="mr-3 h-5 w-5" />
          Factures
        </a>
        <a href="#" className="flex items-center px-3 py-2 text-muted-foreground hover:text-foreground">
          <Clock className="mr-3 h-5 w-5" />
          .......
        </a>
      </nav>
    </aside>
  );

  const renderContent = () => {
    if (isAdding) {
      return (
        <AddProvider 
          onBack={() => setIsAdding(false)}
          onAdd={handleAddProvider}
        />
      );
    }

    if (currentPage === 'providers') {
      return (
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold">Prestataires</h1>
            <Button onClick={() => setIsAdding(true)}>
              Nouveau prestataire
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
                      email: formData.get('filter-email') as string,
                      phone: formData.get('filter-phone') as string,
                      company: formData.get('filter-company') as string,
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
                      placeholder="Nom" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      name="filter-email"
                      defaultValue={filters.email}
                      type="email" 
                      placeholder="Email" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Téléphone</label>
                    <Input 
                      name="filter-phone"
                      defaultValue={filters.phone}
                      type="tel" 
                      placeholder="Téléphone" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Société</label>
                    <Input 
                      name="filter-company"
                      defaultValue={filters.company}
                      type="text" 
                      placeholder="Société" 
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setFilters({
                          name: "",
                          email: "",
                          phone: "",
                          company: ""
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
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Nom de la société</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredProviders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No providers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>{provider.nom}</TableCell>
                      <TableCell>{provider.email}</TableCell>
                      <TableCell>{provider.telephone}</TableCell>
                      <TableCell>{provider.nomSociete}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      );
    }

    if (currentPage === 'dashboard') {
      return <Dashboard />;
    }

    if (currentPage === 'activities') {
      return <Activities />;
    }

    return null;
  };

  return (
    <div className="flex h-screen bg-background">
      {renderSidebar()}
      {renderContent()}
    </div>
  );
}

export default App
