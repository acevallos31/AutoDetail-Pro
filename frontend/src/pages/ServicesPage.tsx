import { motion } from 'framer-motion';
import { Wrench, TimerReset, Droplets, Sparkles, Plus, Zap, Shield, Briefcase } from 'lucide-react';
import { RootLayout } from '../shared/layouts/RootLayout';
import { Card, Button } from '../shared';
import { colors, spacing, typography, borderRadius, shadows } from '../shared/design/tokens';
import { CSSProperties } from 'react';

const services = [
  {
    name: 'Basic Wash',
    category: 'Basic',
    price: '$250',
    duration: '45 min',
    description: 'Lavado exterior e interior completo',
    icon: Droplets,
    gradient: 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)',
    iconBg: 'linear-gradient(to bottom right, #3b82f6, #60a5fa)',
  },
  {
    name: 'Premium Detailing',
    category: 'Premium',
    price: '$750',
    duration: '180 min',
    description: 'Detallado completo con acabados premium',
    icon: Sparkles,
    gradient: 'linear-gradient(to bottom right, #fef3c7, #fcd34d)',
    iconBg: 'linear-gradient(to bottom right, #f59e0b, #fbbf24)',
  },
  {
    name: 'Ceramic Coating',
    category: 'Special',
    price: '$1200',
    duration: '240 min',
    description: 'Protección cerámica de pintura profesional',
    icon: Shield,
    gradient: 'linear-gradient(to bottom right, #a78bfa, #c4b5fd)',
    iconBg: 'linear-gradient(to bottom right, #8b5cf6, #a78bfa)',
  },
  {
    name: 'Paint Protection',
    category: 'Premium',
    price: '$500',
    duration: '120 min',
    description: 'Sellado y protección avanzada de pintura',
    icon: Zap,
    gradient: 'linear-gradient(to bottom right, #d1fae5, #a7f3d0)',
    iconBg: 'linear-gradient(to bottom right, #10b981, #34d399)',
  },
  {
    name: 'Interior Vacuum',
    category: 'Basic',
    price: '$100',
    duration: '30 min',
    description: 'Limpieza profunda de interiores',
    icon: Briefcase,
    gradient: 'linear-gradient(to bottom right, #fecaca, #fca5a5)',
    iconBg: 'linear-gradient(to bottom right, #ef4444, #f87171)',
  },
  {
    name: 'Leather Treatment',
    category: 'Special',
    price: '$300',
    duration: '90 min',
    description: 'Acondicionamiento y protección de cuero',
    icon: Wrench,
    gradient: 'linear-gradient(to bottom right, #e9d5ff, #ddd6fe)',
    iconBg: 'linear-gradient(to bottom right, #a855f7, #c084fc)',
  },
];

export const ServicesPage = () => {
  const headerLabelStyles: CSSProperties = {
    display: 'inline-flex',
    marginBottom: spacing.sm,
    padding: '6px 10px',
    borderRadius: borderRadius.full,
    backgroundColor: colors.infoBg,
    color: colors.primaryDark,
    fontSize: typography.fontSize.xs,
    fontWeight: 700,
    letterSpacing: '0.02em',
  };

  const titleStyles: CSSProperties = {
    fontSize: typography.fontSize['3xl'],
    fontWeight: 700,
    fontFamily: typography.fontFamily.display,
    letterSpacing: '-0.02em',
    color: colors.textDark,
    margin: 0,
  };

  const subtitleStyles: CSSProperties = {
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
    margin: `${spacing.sm} 0 0 0`,
  };

  return (
    <RootLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span style={headerLabelStyles}>CATÁLOGO DE SERVICIOS</span>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: spacing.lg,
              marginTop: spacing.lg,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h2 style={titleStyles}>Servicios Disponibles</h2>
              <p style={subtitleStyles}>Explora nuestro completo menú de servicios de detallado automotriz</p>
            </div>
            <motion.button
              whileHover={{ y: -2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                paddingLeft: spacing.lg,
                paddingRight: spacing.lg,
                paddingTop: spacing.md,
                paddingBottom: spacing.md,
                background: 'linear-gradient(to right, #0284c7, #06b6d4)',
                color: colors.textWhite,
                border: 'none',
                borderRadius: borderRadius.lg,
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: typography.fontSize.sm,
                boxShadow: shadows.glow,
                transition: 'all 200ms ease',
              }}
            >
              <Plus size={16} />
              Nuevo servicio
            </motion.button>
          </div>
        </motion.div>

        {/* Category Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: spacing.lg,
          }}
        >
          {[
            { name: 'Básicos', count: 2, color: '#3b82f6' },
            { name: 'Premium', count: 2, color: '#f59e0b' },
            { name: 'Especiales', count: 2, color: '#8b5cf6' },
          ].map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              style={{
                padding: spacing.lg,
                background: colors.background,
                border: `1px solid ${colors.border}`,
                borderRadius: borderRadius.lg,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: borderRadius.lg,
                  background: `${cat.color}15`,
                  margin: `0 auto ${spacing.md} auto`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: cat.color, fontWeight: 700, fontSize: typography.fontSize.lg }}>
                  {cat.count}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: typography.fontSize.sm, color: colors.textMuted }}>
                {cat.name}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: spacing.lg,
          }}
        >
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                style={{
                  background: service.gradient,
                  border: `1px solid rgba(255,255,255,0.5)`,
                  borderRadius: borderRadius.xl,
                  padding: spacing.xl,
                  cursor: 'pointer',
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: shadows.sm,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = shadows.lg;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = shadows.sm;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: spacing.lg,
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: borderRadius.lg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: service.iconBg,
                    }}
                  >
                    <Icon size={24} color={colors.textWhite} />
                  </div>
                  <span
                    style={{
                      fontSize: typography.fontSize.xs,
                      color: colors.textDark,
                      background: 'rgba(255,255,255,0.7)',
                      padding: `4px ${spacing.sm}`,
                      borderRadius: borderRadius.full,
                      fontWeight: 700,
                    }}
                  >
                    {service.category}
                  </span>
                </div>

                {/* Content */}
                <h3
                  style={{
                    margin: 0,
                    fontSize: typography.fontSize.lg,
                    fontWeight: 700,
                    fontFamily: typography.fontFamily.display,
                    color: colors.textDark,
                    marginBottom: spacing.sm,
                  }}
                >
                  {service.name}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: typography.fontSize.sm,
                    color: colors.textDark,
                    opacity: 0.8,
                    marginBottom: spacing.lg,
                  }}
                >
                  {service.description}
                </p>

                {/* Details */}
                <div
                  style={{
                    display: 'grid',
                    gap: spacing.sm,
                    marginBottom: spacing.lg,
                    paddingBottom: spacing.lg,
                    borderBottom: '1px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: colors.textDark,
                      fontSize: typography.fontSize.sm,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, opacity: 0.8 }}>
                      <Droplets size={14} />
                      Precio
                    </span>
                    <strong style={{ fontSize: typography.fontSize.base }}>{service.price}</strong>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: colors.textDark,
                      fontSize: typography.fontSize.sm,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, opacity: 0.8 }}>
                      <TimerReset size={14} />
                      Duración
                    </span>
                    <strong style={{ fontSize: typography.fontSize.base }}>{service.duration}</strong>
                  </div>
                </div>

                {/* Button */}
                <motion.button
                  whileHover={{ y: -2 }}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'rgba(255,255,255,0.8)',
                    color: colors.textDark,
                    borderRadius: borderRadius.lg,
                    padding: spacing.md,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: typography.fontSize.sm,
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                  }}
                >
                  Ver detalle
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Info Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card variant="elevated">
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
              <Sparkles size={20} color={colors.primary} />
              <p style={{ margin: 0, color: colors.textLight }}>
                Conecta esta vista al endpoint <code>/api/v1/services</code> para cargar servicios dinámicamente desde la base de datos
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </RootLayout>
  );
};
