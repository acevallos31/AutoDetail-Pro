import { motion } from 'framer-motion';
import { Users, Phone, Mail, Car, Calendar, TrendingUp, Filter } from 'lucide-react';
import { RootLayout } from '../shared/layouts/RootLayout';
import { Card } from '../shared';
import { colors, spacing, typography, borderRadius, shadows } from '../shared/design/tokens';
import { CSSProperties } from 'react';

const clients = [
  { name: 'Ana Torres', email: 'ana@email.com', phone: '+51 999 222 111', vehicle: 'Mazda CX-5', visits: 15, spent: '$2,100', status: 'VIP' },
  { name: 'Carlos Mendoza', email: 'carlos@email.com', phone: '+51 988 120 445', vehicle: 'Toyota Hilux', visits: 12, spent: '$1,850', status: 'Regular' },
  { name: 'Maria Vega', email: 'maria@email.com', phone: '+51 944 876 230', vehicle: 'Hyundai Tucson', visits: 8, spent: '$1,200', status: 'Regular' },
  { name: 'Jose Ramirez', email: 'jose@email.com', phone: '+51 977 315 421', vehicle: 'Kia Sportage', visits: 5, spent: '$750', status: 'Nuevo' },
];

export const ClientsPage = () => {
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

  const headerButtonsStyles: CSSProperties = {
    display: 'flex',
    gap: spacing.md,
  };

  const badgeStyles = (type: string): CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `4px ${spacing.sm}`,
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.xs,
    fontWeight: 600,
    ...(type === 'VIP' && {
      backgroundColor: '#fef3c7',
      color: '#92400e',
    }),
    ...(type === 'Regular' && {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
    }),
    ...(type === 'Nuevo' && {
      backgroundColor: '#ecfdf5',
      color: '#065f46',
    }),
  });

  const clientAvatarStyles: CSSProperties = {
    width: '56px',
    height: '56px',
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    color: colors.textWhite,
    fontWeight: 700,
    fontSize: typography.fontSize.lg,
  };

  const statItemStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.lg,
    background: colors.backgroundLight,
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
          <span style={headerLabelStyles}>CARTERA DE CLIENTES</span>
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
              <h2 style={titleStyles}>Gestión de Clientes</h2>
              <p style={subtitleStyles}>Visualiza y administra tu cartera de clientes con estadísticas detalladas</p>
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
              <Filter size={16} />
              Filtrar
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Summary */}
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
            { label: 'Total Clientes', value: '48', icon: Users, trend: '+3' },
            { label: 'Ingresos', value: '$5,900', icon: TrendingUp, trend: '+12%' },
            { label: 'Promedio Visitas', value: '10', icon: Calendar, trend: '+2' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                style={{
                  padding: spacing.lg,
                  background: 'linear-gradient(to bottom right, rgba(3, 132, 199, 0.05), rgba(6, 182, 212, 0.05))',
                  border: `1px solid ${colors.border}`,
                  borderRadius: borderRadius.lg,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: spacing.md,
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: typography.fontSize.sm, color: colors.textMuted }}>
                    {stat.label}
                  </p>
                  <h3 style={{ margin: `${spacing.sm} 0 0 0`, fontSize: typography.fontSize['2xl'], fontWeight: 700, color: colors.textDark }}>
                    {stat.value}
                  </h3>
                  <p style={{ margin: `${spacing.xs} 0 0 0`, fontSize: typography.fontSize.xs, color: colors.success }}>
                    {stat.trend}
                  </p>
                </div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: borderRadius.lg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0284c7, #06b6d4)',
                  }}
                >
                  <Icon size={20} color={colors.textWhite} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Clients Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: spacing.lg }}>
          {clients.map((client, index) => (
            <motion.div
              key={client.email}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              style={{
                background: colors.background,
                border: `1px solid ${colors.border}`,
                borderRadius: borderRadius.xl,
                padding: spacing.xl,
                boxShadow: shadows.sm,
                cursor: 'pointer',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
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
              {/* Header with Avatar and Badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.lg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flex: 1 }}>
                  <div style={clientAvatarStyles}>
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: colors.textDark, fontSize: typography.fontSize.lg, fontWeight: 700 }}>
                      {client.name}
                    </h3>
                    <span style={badgeStyles(client.status)}>{client.status}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div style={{ display: 'grid', gap: spacing.sm, marginBottom: spacing.lg }}>
                <p
                  style={{
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    color: colors.textLight,
                    fontSize: typography.fontSize.sm,
                  }}
                >
                  <Mail size={14} style={{ opacity: 0.6 }} /> {client.email}
                </p>
                <p
                  style={{
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    color: colors.textLight,
                    fontSize: typography.fontSize.sm,
                  }}
                >
                  <Phone size={14} style={{ opacity: 0.6 }} /> {client.phone}
                </p>
                <p
                  style={{
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    color: colors.textLight,
                    fontSize: typography.fontSize.sm,
                  }}
                >
                  <Car size={14} style={{ opacity: 0.6 }} /> {client.vehicle}
                </p>
              </div>

              {/* Stats Footer */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm, paddingTop: spacing.lg, borderTop: `1px solid ${colors.border}` }}>
                <div style={statItemStyles}>
                  <Calendar size={14} style={{ color: colors.primary }} />
                  <div>
                    <p style={{ margin: 0, fontSize: typography.fontSize.xs, color: colors.textMuted }}>Visitas</p>
                    <p style={{ margin: 0, fontSize: typography.fontSize.base, fontWeight: 700, color: colors.textDark }}>
                      {client.visits}
                    </p>
                  </div>
                </div>
                <div style={statItemStyles}>
                  <TrendingUp size={14} style={{ color: colors.success }} />
                  <div>
                    <p style={{ margin: 0, fontSize: typography.fontSize.xs, color: colors.textMuted }}>Gastado</p>
                    <p style={{ margin: 0, fontSize: typography.fontSize.base, fontWeight: 700, color: colors.textDark }}>
                      {client.spent}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </RootLayout>
  );
};
