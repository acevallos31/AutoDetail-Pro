import { motion } from 'framer-motion';
import { Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { RootLayout } from '../shared/layouts/RootLayout';
import { Card, Badge } from '../shared';
import { colors, spacing, typography, shadows, borderRadius } from '../shared/design/tokens';

export const DashboardPage = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'Citas Hoy',
      value: '12',
      change: '+12%',
      icon: Calendar,
      bgGradient: `linear-gradient(135deg, ${colors.primaryLight}20 0%, ${colors.accentLight}20 100%)`,
    },
    {
      title: 'Ingresos Semanal',
      value: '$3,250',
      change: '+8%',
      icon: DollarSign,
      bgGradient: `linear-gradient(135deg, ${colors.success}20 0%, ${colors.success}20 100%)`,
    },
    {
      title: 'Clientes',
      value: '48',
      change: '+15%',
      icon: Users,
      bgGradient: `linear-gradient(135deg, ${colors.warning}20 0%, ${colors.warning}20 100%)`,
    },
    {
      title: 'Ingresos Mensual',
      value: '$12,500',
      change: '+23%',
      icon: TrendingUp,
      bgGradient: `linear-gradient(135deg, ${colors.info}20 0%, ${colors.primary}20 100%)`,
    },
  ];

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

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: `${spacing.lg}`,
          }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: stat.bgGradient,
                  border: `1px solid ${colors.border}`,
                  borderRadius: borderRadius.xl,
                  padding: spacing.lg,
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  boxShadow: shadows.sm,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = shadows.lg;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.textMuted,
                        margin: 0,
                        marginBottom: spacing.sm,
                      }}
                    >
                      {stat.title}
                    </p>
                    <h3
                      style={{
                        fontSize: typography.fontSize['3xl'],
                        fontWeight: 700,
                        fontFamily: typography.fontFamily.display,
                        color: colors.textDark,
                        margin: 0,
                        marginBottom: spacing.sm,
                      }}
                    >
                      {stat.value}
                    </h3>
                    <span
                      style={{
                        fontSize: typography.fontSize.sm,
                        color: colors.success,
                        fontWeight: 600,
                      }}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.textWhite,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* User Info & Recent Activity */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: spacing.lg,
          }}
        >
          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.lg,
                  marginBottom: spacing.lg,
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.textWhite,
                    fontSize: typography.fontSize['2xl'],
                    fontWeight: 700,
                  }}
                >
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: 600,
                      color: colors.textDark,
                      margin: 0,
                    }}
                  >
                    {user?.name || user?.email}
                  </p>
                  {user?.role && (
                    <Badge variant="primary" size="sm">
                      {user.role}
                    </Badge>
                  )}
                </div>
              </div>
              <div
                style={{
                  borderTop: `1px solid ${colors.border}`,
                  paddingTop: spacing.lg,
                }}
              >
                <p
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.textMuted,
                    margin: '0 0 ' + spacing.sm + ' 0',
                  }}
                >
                  Email
                </p>
                <p
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: 500,
                    color: colors.textDark,
                    margin: 0,
                  }}
                >
                  {user?.email}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <h3
                style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: 600,
                  color: colors.textDark,
                  margin: '0 0 ' + spacing.lg + ' 0',
                }}
              >
                Acciones Rápidas
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.md,
                }}
              >
                {['Nueva Cita', 'Agregar Cliente', 'Ver Reportes'].map((action) => (
                  <motion.button
                    key={action}
                    whileHover={{ x: 4 }}
                    style={{
                      padding: spacing.md,
                      backgroundColor: colors.backgroundLight,
                      border: `1px solid ${colors.border}`,
                      borderRadius: borderRadius.lg,
                      cursor: 'pointer',
                      fontSize: typography.fontSize.sm,
                      fontWeight: 600,
                      color: colors.primary,
                      transition: 'all 200ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primaryLight + '15';
                      e.currentTarget.style.borderColor = colors.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.backgroundLight;
                      e.currentTarget.style.borderColor = colors.border;
                    }}
                  >
                    {action}
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </RootLayout>
  );
};
