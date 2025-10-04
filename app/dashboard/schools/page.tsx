"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { SAMPLE_SCHOOLS } from "@/lib/sample-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, MapPin, Phone } from "lucide-react"

export default function SchoolsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter schools based on user role
  const schools = user?.role === "coordenador" ? SAMPLE_SCHOOLS.filter((s) => s.id === user.schoolId) : SAMPLE_SCHOOLS

  const filteredSchools = schools.filter((school) => school.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Escolas</h1>
          <p className="text-muted-foreground">Gerencie as escolas da rede</p>
        </div>
        {user?.role === "admin" && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Escola
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar escolas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredSchools.map((school) => (
          <Card key={school.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{school.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">{school.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{school.phone}</span>
              </div>
              <div className="flex gap-4 pt-2">
                <div>
                  <p className="text-2xl font-bold">{school.totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Alunos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{school.totalTeachers}</p>
                  <p className="text-xs text-muted-foreground">Professores</p>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
