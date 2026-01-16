'use client';

import { motion } from 'framer-motion';
import { Lock, CreditCard, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PaymentButtonProps {
  amount?: string;
  currency?: string;
  onPayment?: () => void;
  isConfirmed?: boolean;
  className?: string;
}

export function PaymentButton({ 
  amount = '99.00', 
  currency = '$',
  onPayment,
  isConfirmed = false,
  className = '' 
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClick = async () => {
    if (isProcessing || isSuccess) return;
    
    setIsProcessing(true);
    
    // Ejecutar callback para iniciar proceso de pago
    if (onPayment) {
      onPayment();
    }
    
    // Mantener procesando hasta que se confirme
  };

  // Actualizar éxito cuando se confirme desde el admin
  useEffect(() => {
    if (isConfirmed && isProcessing) {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Resetear después de 3 segundos
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }
  }, [isConfirmed, isProcessing]);

  return (
    <motion.button
      onClick={handleClick}
      disabled={isProcessing || isSuccess}
      className={`
        relative overflow-hidden
        px-8 py-4 rounded-2xl
        font-semibold text-lg
        transition-all duration-300
        ${isSuccess 
          ? 'bg-green-500 text-white' 
          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
        }
        ${isProcessing ? 'cursor-wait' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={!isProcessing && !isSuccess ? { scale: 1.05 } : {}}
      whileTap={!isProcessing && !isSuccess ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Efecto de brillo animado */}
      {!isSuccess && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: 'easeInOut'
          }}
        />
      )}

      {/* Contenido del botón */}
      <div className="relative flex items-center justify-center gap-3">
        {isProcessing && (
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
            <span>Procesando...</span>
          </motion.div>
        )}

        {isSuccess && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="w-6 h-6" />
            </motion.div>
            <span>¡Pago Exitoso!</span>
          </motion.div>
        )}

        {!isProcessing && !isSuccess && (
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CreditCard className="w-5 h-5" />
            <span>Pagar {currency}{amount}</span>
            <Lock className="w-4 h-4 opacity-80" />
          </motion.div>
        )}
      </div>

      {/* Partículas de éxito */}
      {isSuccess && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              initial={{ 
                x: '50%', 
                y: '50%',
                scale: 0,
                opacity: 1
              }}
              animate={{ 
                x: `${50 + Math.cos((i / 8) * Math.PI * 2) * 100}%`,
                y: `${50 + Math.sin((i / 8) * Math.PI * 2) * 100}%`,
                scale: [0, 1, 0],
                opacity: [1, 1, 0]
              }}
              transition={{ 
                duration: 0.8,
                ease: 'easeOut'
              }}
            />
          ))}
        </>
      )}
    </motion.button>
  );
}
