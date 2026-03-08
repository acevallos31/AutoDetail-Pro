import { motion } from 'framer-motion';
import { Calendar, DollarSign, Users, TrendingUp, ArrowUp, Clock, Zap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { RootLayout } from '../shared/layouts/RootLayout';
import { Card } from '../shared';
import { colors, spacing, typography, shadows, borderRadius } from '../shared/design/tokens';
import { CSSProperties } from 'react';

export const DashboardPage = () => {
  const { user } = useAuthStore();

  const kpiCards = [
    {
      title: 'Citas Hoy',
      value: '12',
      change: '+12%',
      icon: Calendar,
      iconGradient: 'linear-gradient(to bottom right, #3b82f6, #60a5fa)',
      bgGradient: 'linear-gradient(to bottom right, #eff6ff, #dbeafe)',
    },
    {
      title: 'Ingresos Semanal',
      value: '$3,250',
      change: '+8%',
      icon: DollarSign,
      iconGradient: 'linear-gradient(to bottom right, #10b981, #34d399)',
      bgGradient: 'linear-gradient(to bottom right, #ecfdf5, #d1fae5)',
    },
    {
      title: 'Clientes',
      value: '48',
      change: '+15%',
      icon: Users,
      iconGradient: 'linear-gradient(to bottom right, #f59e0b, #fbbf24)',
      bgGradient: 'linear-gradient(to bottom right, #fffbeb, #fef3c7)',
    },
    {
      title: 'Ingresos Mensual',
      value: '$12,500',
      change: '+23%',
      icon: TrendingUp,
      iconGradient: 'linear-gradient(to bottom right, #8b5cf6, #a78bfa)',
      bgGradient: 'linear-gradient(to bottom right, #f5f3ff, #ede9fe)',
    },
  ];

  const kpiHeaderStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  };

  const kpiLabelStyles: CSSProperties = {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    margin: 0,
    marginBottom: spacing.sm,
  };

  const kpiValueStyles: CSSProperties = {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.display,
    color: colors.textDark,
    margin: 0,
    marginBottom: spacing.sm,
    letterSpacing: '-0.02em',
  };

  const kpiSubtextStyles: CSSProperties = {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    margin: 0,
  };

  const trendStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.success,
  };

  const iconWrapperStyles: CSSProperties = {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <RootLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span
            style={{
              display: 'inline-flex',
              marginBottom: spacing.sm,
              padding: '6px 10px',
              borderRadius: borderRadius.full,
              backgroundColor: colors.infoBg,
              color: colors.primaryDark,
              fontSize: typography.fontSize.xs,
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
          >
            RESUMEN OPERATIVO
          </span>
          <h2
            style={{
              fontSize: typography.fontSize['3xl'],
              fontWeight: 700,
              fontFamily: typography.fontFamily.display,
              letterSpacing: '-0.02em',
              color: colors.textDark,
              margin: 0,
            }}
          >
            ¡Bienvenido, {user?.name || 'Usuario'}!
          </h2>
          <p
            style={{
              fontSize: typography.fontSize.base,
              color: colors.textMuted,
              marginTop: spacing.sm,
              margin: 0,
            }}
          >
            Aquí puedes gestionar tu negocio de detallado automotriz
          </p>
        </motion.div>

        {/* KPI Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: spacing.xl,
          }}
        >
          {kpiCards.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: kpi.bgGradient,
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
                <div style={kpiHeaderStyles}>
                  <div style={{ ...iconWrapperStyles, background: kpi.iconGradient }}>
                    <Icon style={{ width: '24px', height: '24px', color: colors.textWhite }} />
                  </div>
                  <div style={trendStyles}>
                    <ArrowUp style={{ width: '16px', height: '16px' }} />
                    {kpi.change}
                  </div>
                </div>
                <p style={kpiLabelStyles}>{kpi.title}</p>
                <p style={kpiValueStyles}>{kpi.value}</p>
                <p style={kpiSubtextStyles}>vs período anterior</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: 700,
              fontFamily: typography.fontFamily.display,
              color: colors.textDark,
              marginBottom: spacing.lg,
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            Acciones Rápidas
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: spacing.lg,
            }}
          >
            {[
              { label: 'Nueva Cita', icon: Calendar, color: '#3b82f6' },
              { label: 'Ver Clientes', icon: Users, color: '#f59e0b' },
              { label: 'Servicios', icon: Zap, color: '#8b5cf6' },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                    padding: spacing.lg,
                    background: colors.background,
                    border: `1px solid ${colors.border}`,
                    borderRadius: borderRadius.lg,
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    fontSize: typography.fontSize.base,
                    fontWeight: 600,
                    color: colors.textDark,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = shadows.lg;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = shadows.sm;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: borderRadius.lg,
                      background: `${action.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={16} style={{ color: action.color }} />
                  </div>
                  {action.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="elevated">
            <h3
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: 700,
                color: colors.textDark,
                marginBottom: spacing.lg,
                margin: 0,
              }}
            >
              Actividad Reciente
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.md,
              }}
            >
              {[
                { time: 'Hace 2 horas', action: 'Nueva cita agendada', detail: 'Carlos Mendoza - Toyota Hilux' },
                { time: 'Hace 5 horas', action: 'Servicio completado', detail: 'Premium Detailing - Ana Torres' },
                { time: 'Hace 1 día', action: 'Nuevo cliente', detail: 'Maria Vega' },
              ].map((activity, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: spacing.md,
                    borderLeft: `3px solid ${colors.primary}`,
                    background: colors.backgroundLight,
                    borderRadius: borderRadius.lg,
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: colors.textDark }}>{activity.action}</p>
                    <p style={{ margin: `${spacing.xs} 0 0 0`, fontSize: typography.fontSize.sm, color: colors.textMuted }}>
                      {activity.detail}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: typography.fontSize.xs, color: colors.textMuted }}>
                    {activity.time}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </RootLayout>
  );
};
