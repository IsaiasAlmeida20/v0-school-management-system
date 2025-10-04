"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">PROJETO A+</h1>
          <p className="mt-2 text-muted-foreground">Sistema de Gestão Escolar</p>
        </div>

        <LoginForm />

        <div className="rounded-lg border bg-card p-4 text-sm">
          <p className="mb-2 font-medium">Usuários de teste:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• admin@escolaa.com.br (Administrador)</li>
            <li>• maria.geral@escolaa.com.br (Coord. Geral)</li>
            <li>• joao.coord@escolaa.com.br (Coordenador)</li>
            <li>• ana.prof@escolaa.com.br (Professor)</li>
          </ul>
          <p className="mt-2 text-xs">Qualquer senha funciona para demonstração</p>
        </div>
      </div>
    </div>
  )
}
