import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface ReservationStats {
  total: number;
  enAttenteValidation: number;
  enAttentePaiement: number;
  paye: number;
  annule: number;
}

interface ReservationEnAttente {
  activite: string;
  date: string;
  participants: string;
  placesRestantes: string;
  nomClient: string;
}

interface Activity {
  timestamp: string;
  description: string;
}

export function Dashboard() {
  const stats: ReservationStats = {
    total: 120,
    enAttenteValidation: 3,
    enAttentePaiement: 10,
    paye: 105,
    annule: 2
  };

  const reservationsEnAttente: ReservationEnAttente[] = [
    {
      activite: "Jimmy PT",
      date: "17/02/2025",
      participants: "2A, 1E (âgé)",
      placesRestantes: "R1",
      nomClient: "Princesse Sicilia"
    },
    {
      activite: "Pouldo PT",
      date: "18/02/2025",
      participants: "2A, 3E (âgé, âgé, âgé)",
      placesRestantes: "R3",
      nomClient: "Princesse Sicilia"
    }
  ];

  const recentActivities: Activity[] = [
    {
      timestamp: "14 fév 2025, 17:33",
      description: "Anne a annulé une réservation"
    },
    {
      timestamp: "14 fév 2025, 16:45",
      description: "Anne a ajouté un prestataire"
    }
  ];

  // Sample data for the chart
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    today: Math.floor(Math.random() * 1000),
    previous: Math.floor(Math.random() * 1000),
  }));

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-muted-foreground">Mardi 4 février</p>
          <h1 className="text-2xl font-semibold">Bonjour, Thierry.</h1>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="aujourd'hui">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aujourd'hui">Aujourd'hui</SelectItem>
              <SelectItem value="semaine">Cette semaine</SelectItem>
              <SelectItem value="mois">Ce mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Nombre de réservations</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">En attente de validation</div>
            <div className="text-2xl font-bold">{stats.enAttenteValidation}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">En attente de paiement</div>
            <div className="text-2xl font-bold">{stats.enAttentePaiement}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Payé</div>
            <div className="text-2xl font-bold">{stats.paye}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Annulé</div>
            <div className="text-2xl font-bold">{stats.annule}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-[2fr,1fr] gap-8">
        <div className="space-y-8">
          {/* Pending Reservations */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Réservations en attente de validation</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activité</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Places restantes</TableHead>
                    <TableHead>Nom client</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservationsEnAttente.map((reservation, index) => (
                    <TableRow key={index}>
                      <TableCell>{reservation.activite}</TableCell>
                      <TableCell>{reservation.date}</TableCell>
                      <TableCell>{reservation.participants}</TableCell>
                      <TableCell>{reservation.placesRestantes}</TableCell>
                      <TableCell>{reservation.nomClient}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Approuver</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Réservations par jour</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Today</span>
                    <span>569</span>
                    <span className="text-red-500">-38.8%</span>
                  </div>
                </div>
                <Button variant="outline">Jan 27, 2025 - Fév 1, 2025</Button>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="today" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="previous" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Activité récente</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 