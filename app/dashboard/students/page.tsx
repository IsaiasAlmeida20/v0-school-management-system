"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { SAMPLE_STUDENTS, SAMPLE_CLASSES, SAMPLE_SCHOOLS } from "@/lib/sample-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Eye } from "lucide-react"

export default function StudentsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedSchool, setSelectedSchool] = useState<string>("all")

  // Filter students based on user role
  let availableStudents = SAMPLE_STUDENTS
  let availableClasses = SAMPLE_CLASSES

  if (user?.role === "coordenador") {
    availableClasses = SAMPLE_CLASSES.filter((c) => c.schoolId === user.schoolId)
    availableStudents = SAMPLE_STUDENTS.filter((s) => availableClasses.some((c) => c.id === s.classId))
  } else if (user?.role === "professor") {
    availableClasses = SAMPLE_CLASSES.filter((c) => user.classIds?.includes(c.id))
    availableStudents = SAMPLE_STUDENTS.filter((s) => availableClasses.some((c) => c.id === s.classId))
  }

  // Apply filters
  const filteredStudents = availableStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = selectedClass === "all" || student.classId === selectedClass

    if (selectedSchool !== "all") {
      const studentClass = SAMPLE_CLASSES.find((c) => c.id === student.classId)
      return matchesSearch && matchesClass && studentClass?.schoolId === selectedSchool
    }

    return matchesSearch && matchesClass
  })

  const canManageStudents = user?.role === "admin" || user?.role === "coordenador_geral" || user?.role === "coordenador"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground">Gerencie os alunos matriculados</p>
        </div>
        {canManageStudents && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Aluno
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar alunos..."
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
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Todas as turmas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as turmas</SelectItem>
            {availableClasses.map((classItem) => (
              <SelectItem key={classItem.id} value={classItem.id}>
                {classItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.slice(0, 20).map((student) => {
                const studentClass = SAMPLE_CLASSES.find((c) => c.id === student.classId)
                const school = SAMPLE_SCHOOLS.find((s) => s.id === studentClass?.schoolId)

                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{studentClass?.name}</p>
                        <p className="text-xs text-muted-foreground">{school?.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{student.email}</TableCell>
                    <TableCell className="text-muted-foreground">{student.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant={student.status === "active" ? "default" : "secondary"}
                        className={student.status === "active" ? "bg-secondary text-secondary-foreground" : ""}
                      >
                        {student.status === "active"
                          ? "Ativo"
                          : student.status === "transferred"
                            ? "Transferido"
                            : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filteredStudents.length > 20 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Mostrando 20 de {filteredStudents.length} alunos
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
