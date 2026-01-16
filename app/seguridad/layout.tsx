import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Centro de Seguridad | CVVINVEST",
  description: "Centro de Seguridad de CVVINVEST. Información sobre protección de cuenta, autenticación, validación de transacciones y consejos de seguridad.",
  keywords: "seguridad, protección, contraseña, autenticación, CVVINVEST",
  openGraph: {
    title: "Centro de Seguridad | CVVINVEST",
    description: "Protegemos tu cuenta con las mejores prácticas de seguridad",
  },
}

export default function SeguridadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
