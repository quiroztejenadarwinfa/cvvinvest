'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    paypal?: any
  }
}

interface PayPalHostedButtonProps {
  hostedButtonId: string
  containerId: string
  onLoad?: () => void
  onSuccess?: () => void
}

export function PayPalHostedButton({
  hostedButtonId,
  containerId,
  onLoad,
  onSuccess,
}: PayPalHostedButtonProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Cargar PayPal SDK si no está cargado
    if (window.paypal?.HostedButtons) {
      renderButton()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://www.paypal.com/sdk/js?client-id=BAA_QUv7h87scMdybBgG5bk8hnXGR8BlzUT15U4OJXvw59O8g8Eu9eSsFHiLIPul_KI9tFLpA0lwNJkpCU&components=hosted-buttons&disable-funding=venmo&currency=USD'
    script.async = true
    script.crossOrigin = 'anonymous'

    script.onload = () => {
      renderButton()
    }

    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [hostedButtonId, containerId])

  const renderButton = () => {
    if (window.paypal?.HostedButtons && document.getElementById(containerId)) {
      try {
        window.paypal.HostedButtons({
          hostedButtonId,
          onApprove: () => {
            // Se llama cuando el pago se aprueba
            if (onSuccess) {
              onSuccess()
            }
          },
          onError: (err: any) => {
            console.error('Error en PayPal:', err)
          }
        }).render(`#${containerId}`)
        setIsLoaded(true)
        if (onLoad) {
          onLoad()
        }
      } catch (error) {
        console.error('Error rendering PayPal button:', error)
      }
    }
  }

  return <div id={containerId} className="paypal-button-container" />
}
