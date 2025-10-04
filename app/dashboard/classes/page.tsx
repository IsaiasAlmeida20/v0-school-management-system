"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { SAMPLE_CLASSES, SAMPLE_SCHOOLS, SAMPLE_TEACHERS, SAMPLE_STUDENTS } from "@/lib/sample-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Users } from "lucide-react"

export default function ClassesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSchool, setSelectedSchool] = useState<string>("all")

  // Filter classes based on user role
  let availableClasses = SAMPLE_CLASSES
  if (user?.role === "coordenador") {
    availableClasses = SAMPLE_CLASSES.filter((c) => c.schoolId === user.schoolId)
  } else if (user?.role === "professor") {
    availableClasses = SAMPLE_CLASSES.filter((c) => user.classIds?.includes(c.id))
  }

  // Apply filters
  const filteredClasses = availableClasses.filter((classItem) => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSchool = selectedSchool === "all" || classItem.schoolId === selectedSchool
    return matchesSearch && matchesSchool
  })

  const canManageClasses = user?.role === "admin" || user?.role === "coordenador_geral" || user?.role === "coordenador"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Turmas</h1>
          <p className="text-muted-foreground">Gerencie as turmas e suas informações</p>
        </div>
        {canManageClasses && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Turma
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar turmas..."
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
        {filteredClasses.map((classItem) => {
          const school = SAMPLE_SCHOOLS.find((s) => s.id === classItem.schoolId)
          const teacher = SAMPLE_TEACHERS.find((t) => t.id === classItem.teacherId)
          const students = SAMPLE_STUDENTS.filter((s) => s.classId === classItem.id)

          return (
            <Card key={classItem.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                  <Badge variant="secondary" className="capitalize">
                    {classItem.shift}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{school?.name}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Professor:</span>
                    <span className="font-medium">{teacher?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Série:</span>
                    <span className="font-medium">{classItem.grade}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{students.length}</span>
                    <span className="text-muted-foreground">alunos</span>
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

      {filteredClasses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhuma turma encontrada</p>
            <p className="text-sm text-muted-foreground">Tente ajustar os filtros de busca</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
