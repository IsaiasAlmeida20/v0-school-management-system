"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { SAMPLE_TEACHERS, SAMPLE_SCHOOLS, SAMPLE_CLASSES } from "@/lib/sample-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Mail, Phone, BookOpen } from "lucide-react"

export default function TeachersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSchool, setSelectedSchool] = useState<string>("all")

  // Filter teachers based on user role
  let availableTeachers = SAMPLE_TEACHERS
  if (user?.role === "coordenador") {
    availableTeachers = SAMPLE_TEACHERS.filter((t) => t.schoolId === user.schoolId)
  }

  // Apply filters
  const filteredTeachers = availableTeachers.filter((teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSchool = selectedSchool === "all" || teacher.schoolId === selectedSchool
    return matchesSearch && matchesSchool
  })

  const canManageTeachers = user?.role === "admin" || user?.role === "coordenador_geral" || user?.role === "coordenador"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professores</h1>
          <p className="text-muted-foreground">Gerencie os professores da rede</p>
        </div>
        {canManageTeachers && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Professor
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar professores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        {(user?.role === "admin" || user?.role === "coordenador_geral") && (
          <Select value={selectedSchool} onValueChange={setSelectedSchool}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Todas as escolas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as escolas</SelectItem>
              {SAMPLE_SCHOOLS.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeachers.map((teacher) => {
          const school = SAMPLE_SCHOOLS.find((s) => s.id === teacher.schoolId)
          const teacherClasses = SAMPLE_CLASSES.filter((c) => c.teacherId === teacher.id)

          return (
            <Card key={teacher.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{teacher.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{school?.name}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{teacher.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{teacherClasses.length}</span>
                    <span className="text-muted-foreground">turmas</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Disciplinas:</p>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTeachers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhum professor encontrado</p>
            <p className="text-sm text-muted-foreground">Tente ajustar os filtros de busca</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
