import { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  ArrowUp,
  ArrowDown,
  Sparkles
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { RootLayout } from '../shared/layouts/RootLayout';
import { colors, spacing, typography, borderRadius, shadows } from '../shared/design/tokens';

export const AnalyticsPage = () => {
  const monthlyRevenue = [
    { month: 'Ene', ingresos: 8500, gastos: 3200 },
    { month: 'Feb', ingresos: 9200, gastos: 3400 },
    { month: 'Mar', ingresos: 12800, gastos: 3800 }
  ];

  const serviceDistribution = [
    { name: 'Detallado Completo', value: 35, color: '#3b82f6' },
    { name: 'Lavado Premium', value: 25, color: '#06b6d4' },
    { name: 'Protección Cerámica', value: 20, color: '#8b5cf6' },
    { name: 'Pulido', value: 12, color: '#ec4899' },
    { name: 'Otros', value: 8, color: '#f59e0b' }
  ];

  const weeklyAppointments = [
    { day: 'Lun', citas: 8 },
    { day: 'Mar', citas: 12 },
    { day: 'Mié', citas: 15 },
    { day: 'Jue', citas: 10 },
    { day: 'Vie', citas: 18 },
    { day: 'Sáb', citas: 22 },
    { day: 'Dom', citas: 14 }
  ];

  const topClients = [
    { name: 'Ana Torres', spent: 2100, visits: 15 },
    { name: 'Carlos Mendoza', spent: 1850, visits: 12 },
    { name: 'José Ramírez', spent: 1250, visits: 5 }
  ];

  const containerStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xl,
  };

  const gridStyles: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing.xl,
  };

  const grid2to1Styles: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: spacing.xl,
  };

  const cardStyles: CSSProperties = {
    background: colors.background,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.lg,
    padding: spacing.xl,
    border: `1px solid ${colors.border}`,
  };

  const kpiCardStyles = (gradient: string): CSSProperties => ({
    ...cardStyles,
    background: gradient,
  });

  const iconWrapperStyles = (gradient: string): CSSProperties => ({
    padding: spacing.md,
    background: gradient,
    borderRadius: borderRadius.xl,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const kpiHeaderStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  };

  const kpiTrendStyles = (isPositive: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: isPositive ? colors.success : colors.error,
  });

  const kpiLabelStyles: CSSProperties = {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
    marginBottom: '4px',
  };

  const kpiValueStyles: CSSProperties = {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textDark,
  };

  const kpiSubtextStyles: CSSProperties = {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
  };

  const titleStyles: CSSProperties = {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.xl,
  };

  const legendItemStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.sm,
  };

  const legendDotStyles = (color: string): CSSProperties => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: color,
    marginRight: spacing.sm,
  });

  return (
    <RootLayout>
      <div style={containerStyles}>
        {/* KPI Cards */}
        <div style={gridStyles}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={kpiCardStyles('linear-gradient(to bottom right, #ecfdf5, #d1fae5)')}
          >
            <div style={kpiHeaderStyles}>
              <div style={iconWrapperStyles('linear-gradient(to bottom right, #10b981, #34d399)')}>
                <DollarSign style={{ width: '24px', height: '24px', color: colors.textWhite }} />
              </div>
              <div style={kpiTrendStyles(true)}>
                <ArrowUp style={{ width: '16px', height: '16px' }} />
                23%
              </div>
            </div>
            <p style={kpiLabelStyles}>Ingresos Este Mes</p>
            <p style={kpiValueStyles}>$12,800</p>
            <p style={kpiSubtextStyles}>vs $10,400 mes anterior</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={kpiCardStyles('linear-gradient(to bottom right, #eff6ff, #dbeafe)')}
          >
            <div style={kpiHeaderStyles}>
              <div style={iconWrapperStyles('linear-gradient(to bottom right, #3b82f6, #60a5fa)')}>
                <Calendar style={{ width: '24px', height: '24px', color: colors.textWhite }} />
              </div>
              <div style={kpiTrendStyles(true)}>
                <ArrowUp style={{ width: '16px', height: '16px' }} />
                12%
              </div>
            </div>
            <p style={kpiLabelStyles}>Citas Este Mes</p>
            <p style={kpiValueStyles}>156</p>
            <p style={kpiSubtextStyles}>vs 139 mes anterior</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={kpiCardStyles('linear-gradient(to bottom right, #faf5ff, #f3e8ff)')}
          >
            <div style={kpiHeaderStyles}>
              <div style={iconWrapperStyles('linear-gradient(to bottom right, #8b5cf6, #a78bfa)')}>
                <Users style={{ width: '24px', height: '24px', color: colors.textWhite }} />
              </div>
              <div style={kpiTrendStyles(true)}>
                <ArrowUp style={{ width: '16px', height: '16px' }} />
                15%
              </div>
            </div>
            <p style={kpiLabelStyles}>Nuevos Clientes</p>
            <p style={kpiValueStyles}>23</p>
            <p style={kpiSubtextStyles}>vs 20 mes anterior</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={kpiCardStyles('linear-gradient(to bottom right, #fef2f2, #fee2e2)')}
          >
            <div style={kpiHeaderStyles}>
              <div style={iconWrapperStyles('linear-gradient(to bottom right, #f97316, #fb923c)')}>
                <TrendingUp style={{ width: '24px', height: '24px', color: colors.textWhite }} />
              </div>
              <div style={kpiTrendStyles(false)}>
                <ArrowDown style={{ width: '16px', height: '16px' }} />
                5%
              </div>
            </div>
            <p style={kpiLabelStyles}>Tasa de Cancelación</p>
            <p style={kpiValueStyles}>3.2%</p>
            <p style={kpiSubtextStyles}>vs 3.4% mes anterior</p>
          </motion.div>
        </div>

        {/* Charts Row 1 */}
        <div style={grid2to1Styles}>
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={cardStyles}
          >
            <h3 style={titleStyles}>Ingresos vs Gastos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis dataKey="month" stroke={colors.textLight} />
                <YAxis stroke={colors.textLight} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.background, 
                    border: `1px solid ${colors.border}`,
                    borderRadius: borderRadius.lg,
                    boxShadow: shadows.md,
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ingresos" 
                  stroke={colors.success}
                  strokeWidth={3}
                  dot={{ fill: colors.success, r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="gastos" 
                  stroke={colors.error}
                  strokeWidth={3}
                  dot={{ fill: colors.error, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Service Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            style={cardStyles}
          >
            <h3 style={titleStyles}>Distribución de Servicios</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.background, 
                    border: `1px solid ${colors.border}`,
                    borderRadius: borderRadius.lg,
                    boxShadow: shadows.md,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: spacing.lg }}>
              {serviceDistribution.map((item, index) => (
                <div key={index} style={legendItemStyles}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={legendDotStyles(item.color)} />
                    <span style={{ color: colors.textLight }}>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: typography.fontWeight.semibold, color: colors.textDark }}>
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div style={grid2to1Styles}>
          {/* Weekly Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={cardStyles}
          >
            <h3 style={titleStyles}>Citas por Día de la Semana</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyAppointments}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis dataKey="day" stroke={colors.textLight} />
                <YAxis stroke={colors.textLight} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.background, 
                    border: `1px solid ${colors.border}`,
                    borderRadius: borderRadius.lg,
                    boxShadow: shadows.md,
                  }}
                />
                <Bar 
                  dataKey="citas" 
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.primary} />
                    <stop offset="100%" stopColor={colors.accent} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Clients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={cardStyles}
          >
            <h3 style={titleStyles}>Top Clientes</h3>
            <div>
              {topClients.map((client, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  style={{
                    padding: spacing.lg,
                    background: `linear-gradient(to right, ${colors.backgroundLight}, ${colors.backgroundLighter})`,
                    borderRadius: borderRadius.xl,
                    border: `1px solid ${colors.border}`,
                    marginBottom: spacing.lg,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.accent})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.textWhite,
                        fontWeight: typography.fontWeight.bold,
                        fontSize: typography.fontSize.sm,
                      }}
                    >
                      #{index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: typography.fontWeight.bold, color: colors.textDark, fontSize: typography.fontSize.base }}>
                        {client.name}
                      </h4>
                      <p style={{ fontSize: typography.fontSize.xs, color: colors.textLight }}>
                        {client.visits} visitas
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: spacing.md,
                      paddingTop: spacing.md,
                      borderTop: `1px solid ${colors.borderDark}`,
                    }}
                  >
                    <span style={{ fontSize: typography.fontSize.sm, color: colors.textLight }}>Total gastado</span>
                    <span style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.success }}>
                      ${client.spent.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{
            ...cardStyles,
            background: `linear-gradient(to bottom right, ${colors.sidebarDark}, ${colors.sidebarLight})`,
            color: colors.textWhite,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.xl }}>
            <div
              style={{
                padding: spacing.md,
                background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.accent})`,
                borderRadius: borderRadius.xl,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles style={{ width: '24px', height: '24px', color: colors.textWhite }} />
            </div>
            <div>
              <h3 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.textWhite }}>
                Resumen de Rendimiento
              </h3>
              <p style={{ color: colors.textMuted }}>Marzo 2026</p>
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: spacing.xl,
            }}
          >
            <div>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.textMuted, marginBottom: spacing.xs }}>
                Tasa de Conversión
              </p>
              <p style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.textWhite }}>
                87%
              </p>
            </div>
            <div>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.textMuted, marginBottom: spacing.xs }}>
                Satisfacción Cliente
              </p>
              <p style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.textWhite }}>
                4.8/5
              </p>
            </div>
            <div>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.textMuted, marginBottom: spacing.xs }}>
                Tiempo Promedio
              </p>
              <p style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.textWhite }}>
                105 min
              </p>
            </div>
            <div>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.textMuted, marginBottom: spacing.xs }}>
                Ticket Promedio
              </p>
              <p style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.textWhite }}>
                $82
              </p>
            </div>
            <div>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.textMuted, marginBottom: spacing.xs }}>
                Retención
              </p>
              <p style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.textWhite }}>
                92%
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </RootLayout>
  );
};
