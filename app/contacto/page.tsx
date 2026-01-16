"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addMessage } from "@/lib/messages"

export default function ContactoPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [platformPhone, setPlatformPhone] = useState("No disponible temporalmente")
  const { toast } = useToast()

  useEffect(() => {
    // Cargar teléfono de configuración
    const config = localStorage.getItem("admin_config")
    if (config) {
      const parsed = JSON.parse(config)
      if (parsed.platformPhone) {
        setPlatformPhone(parsed.platformPhone)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      addMessage({
        name,
        email,
        subject,
        message,
      })

      toast({
        title: "Mensaje enviado",
        description: "Hemos recibido tu mensaje. Te responderemos pronto.",
      })

      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar el mensaje.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-primary">Contáctanos</span>
            </h1>
            <p className="text-lg text-muted-foreground">¿Tienes preguntas? Nuestro equipo está listo para ayudarte.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <a href="mailto:soportecvvinvest@proton.me" className="block p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-primary hover:underline">soportecvvinvest@proton.me</div>
                  </div>
                </div>
              </a>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Teléfono</div>
                    <div className="text-sm text-muted-foreground">{platformPhone}</div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Chat en Vivo</div>
                    <div className="text-sm text-muted-foreground">Disponible 24/7</div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Horario</div>
                    <div className="text-sm text-muted-foreground">Abierto 24/7</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="p-8 rounded-2xl bg-card border border-border">
                <h2 className="text-xl font-bold mb-6">Envíanos un mensaje</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">NOMBRE</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-secondary border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">EMAIL</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-secondary border-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">ASUNTO</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-secondary border-border"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">MENSAJE</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-secondary border-border min-h-32"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
                    {loading ? (
                      "Enviando..."
                    ) : (
                      <>
                        Enviar Mensaje
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
