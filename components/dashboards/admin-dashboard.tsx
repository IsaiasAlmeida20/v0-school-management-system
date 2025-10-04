"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SAMPLE_SCHOOLS, SAMPLE_CLASSES, SAMPLE_TEACHERS, SAMPLE_STUDENTS } from "@/lib/sample-data"
import { School, Users, GraduationCap, UserCheck } from "lucide-react"

export function AdminDashboard() {
  const totalSchools = SAMPLE_SCHOOLS.length
  const totalClasses = SAMPLE_CLASSES.length
  const totalTeachers = SAMPLE_TEACHERS.length
  const totalStudents = SAMPLE_STUDENTS.length

  const stats = [
    {
      title: "Escolas",
      value: totalSchools,
      icon: School,
      description: "Escolas na rede",
    },
    {
      title: "Turmas",
      value: totalClasses,
      icon: Users,
      description: "Turmas ativas",
    },
    {
      title: "Professores",
      value: totalTeachers,
      icon: GraduationCap,
      description: "Professores cadastrados",
    },
    {
      title: "Alunos",
      value: totalStudents,
      icon: UserCheck,
      description: "Alunos matriculados",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral da Rede</h1>
        <p className="text-muted-foreground">Acompanhe as métricas principais do sistema</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Escolas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {SAMPLE_SCHOOLS.map((school) => (
                <div key={school.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{school.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {school.totalStudents} alunos • {school.totalTeachers} professores
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted">
                <p className="font-medium">Cadastrar Nova Escola</p>
                <p className="text-sm text-muted-foreground">Adicionar escola à rede</p>
              </button>
              <button className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted">
                <p className="font-medium">Gerenciar Usuários</p>
                <p className="text-sm text-muted-foreground">Adicionar coordenadores e professores</p>
              </button>
              <button className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted">
                <p className="font-medium">Relatórios Gerais</p>
                <p className="text-sm text-muted-foreground">Visualizar relatórios da rede</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
