import { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, CircleCheck, CarFront, Search, MapPin, Phone, ChevronRight } from 'lucide-react';
import { RootLayout } from '../shared/layouts/RootLayout';
import { Card, Button } from '../shared';
import { colors, spacing, typography, borderRadius, shadows } from '../shared/design/tokens';

const appointments = [
  {
    id: 'APT-2041',
    client: 'Carlos Mendoza',
    phone: '+51 988 120 445',
    vehicle: 'Toyota Hilux 2022',
    plate: 'APX-2841',
    time: '09:00',
    status: 'confirmed',
    service: 'Premium Detailing',
    duration: '180 min',
    location: 'Booth 1',
  },
  {
    id: 'APT-2042',
    client: 'Ana Torres',
    phone: '+51 999 222 111',
    vehicle: 'Mazda CX-5 2021',
    plate: 'BOP-3102',
    time: '10:30',
    status: 'in_progress',
    service: 'Ceramic Coating',
    duration: '240 min',
    location: 'Booth 2',
  },
  {
    id: 'APT-2043',
    client: 'Jose Ramirez',
    phone: '+51 977 315 421',
    vehicle: 'Kia Sportage 2020',
    plate: 'COP-4215',
    time: '12:15',
    status: 'pending',
    service: 'Basic Wash',
    duration: '45 min',
    location: 'Waiting',
  },
  {
    id: 'APT-2044',
    client: 'Maria Vega',
    phone: '+51 944 876 230',
    vehicle: 'Hyundai Tucson 2023',
    plate: 'DOP-5321',
    time: '15:00',
    status: 'confirmed',
    service: 'Paint Protection',
    duration: '120 min',
    location: 'Booth 1',
  },
];

const statusConfig: Record<string, { bg: string; color: string; label: string; gradient: string }> = {
  confirmed: {
    bg: colors.infoBg,
    color: colors.info,
    label: 'Confirmada',
    gradient: 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)',
  },
  in_progress: {
    bg: colors.warningBg,
    color: colors.warning,
    label: 'En Proceso',
    gradient: 'linear-gradient(to bottom right, #fef3c7, #fcd34d)',
  },
  pending: {
    bg: colors.backgroundLighter,
    color: colors.textLight,
    label: 'Pendiente',
    gradient: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
  },
};

export const AppointmentsPage = () => {
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

  const metricCardStyles = (gradient: string): CSSProperties => ({
    background: gradient,
    border: `1px solid rgba(255,255,255,0.5)`,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  });

  return (
    <RootLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span style={headerLabelStyles}>AGENDA DIARIA</span>
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
              <h2 style={titleStyles}>Calendario de Citas</h2>
              <p
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.textMuted,
                  margin: `${spacing.sm} 0 0 0`,
                }}
              >
                Gestiona las citas programadas y monitorea el estado operativo en tiempo real
              </p>
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
              Nueva cita
            </motion.button>
          </div>
        </motion.div>

        {/* Metrics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: spacing.xl,
          }}
        >
          {[
            {
              label: 'Total Hoy',
              value: '12',
              icon: CalendarDays,
              gradient: 'linear-gradient(to bottom right, #eff6ff, #dbeafe)',
              iconGradient: 'linear-gradient(to bottom right, #3b82f6, #60a5fa)',
            },
            {
              label: 'En Proceso',
              value: '4',
              icon: Clock,
              gradient: 'linear-gradient(to bottom right, #fef3c7, #fcd34d)',
              iconGradient: 'linear-gradient(to bottom right, #f59e0b, #fbbf24)',
            },
            {
              label: 'Completadas',
              value: '7',
              icon: CircleCheck,
              gradient: 'linear-gradient(to bottom right, #ecfdf5, #d1fae5)',
              iconGradient: 'linear-gradient(to bottom right, #10b981, #34d399)',
            },
            {
              label: 'Vehículos Activos',
              value: '5',
              icon: CarFront,
              gradient: 'linear-gradient(to bottom right, #f5f3ff, #ede9fe)',
              iconGradient: 'linear-gradient(to bottom right, #8b5cf6, #a78bfa)',
            },
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                style={metricCardStyles(metric.gradient)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: typography.fontSize.sm,
                        color: colors.textMuted,
                        marginBottom: spacing.sm,
                      }}
                    >
                      {metric.label}
                    </p>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: typography.fontSize['3xl'],
                        fontWeight: 700,
                        fontFamily: typography.fontFamily.display,
                        color: colors.textDark,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {metric.value}
                    </h3>
                  </div>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: borderRadius.lg,
                      background: metric.iconGradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} color={colors.textWhite} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Appointments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="elevated">
            {/* Search and Title */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.lg,
                gap: spacing.md,
                flexWrap: 'wrap',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: typography.fontSize.lg,
                  fontWeight: 700,
                  color: colors.textDark,
                }}
              >
                Listado de Citas
              </h3>
              <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 260px', maxWidth: '360px' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: spacing.md,
                    transform: 'translateY(-50%)',
                    color: colors.textMuted,
                  }}
                />
                <input
                  placeholder="Buscar por cliente o placa..."
                  style={{
                    width: '100%',
                    padding: `${spacing.md} ${spacing.md} ${spacing.md} ${spacing.lg}`,
                    borderRadius: borderRadius.lg,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.backgroundLight,
                    boxShadow: shadows.sm,
                    outline: 'none',
                    fontSize: typography.fontSize.sm,
                    transition: 'all 200ms ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = shadows.md;
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = shadows.sm;
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                />
              </div>
            </div>

            {/* Appointments */}
            <div style={{ display: 'grid', gap: spacing.md }}>
              {appointments.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.06 }}
                  style={{
                    background: statusConfig[apt.status].gradient,
                    border: `1px solid rgba(255,255,255,0.5)`,
                    borderRadius: borderRadius.lg,
                    padding: spacing.lg,
                    cursor: 'pointer',
                    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.lg,
                    flexWrap: 'wrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = shadows.lg;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Client Info */}
                  <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        color: colors.textDark,
                        fontSize: typography.fontSize.base,
                      }}
                    >
                      {apt.client}
                    </p>
                    <p
                      style={{
                        margin: `${spacing.xs} 0 0 0`,
                        fontSize: typography.fontSize.sm,
                        color: colors.textLight,
                      }}
                    >
                      {apt.vehicle}
                    </p>
                    <p
                      style={{
                        margin: `${spacing.xs} 0 0 0`,
                        fontSize: typography.fontSize.xs,
                        color: colors.textMuted,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span style={{ opacity: 0.7 }}>Placa:</span> {apt.plate}
                    </p>
                  </div>

                  {/* Service Info */}
                  <div style={{ flex: '0 1 auto', minWidth: '140px' }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: typography.fontSize.sm,
                        color: colors.textDark,
                        fontWeight: 600,
                      }}
                    >
                      {apt.service}
                    </p>
                    <p
                      style={{
                        margin: `${spacing.xs} 0 0 0`,
                        fontSize: typography.fontSize.xs,
                        color: colors.textMuted,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Clock size={12} /> {apt.duration}
                    </p>
                  </div>

                  {/* Time and Location */}
                  <div style={{ flex: '0 1 auto', minWidth: '140px', display: 'flex', gap: spacing.lg }}>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: typography.fontSize.lg,
                          fontWeight: 700,
                          color: colors.textDark,
                        }}
                      >
                        {apt.time}
                      </p>
                      <p
                        style={{
                          margin: `${spacing.xs} 0 0 0`,
                          fontSize: typography.fontSize.xs,
                          color: colors.textMuted,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <MapPin size={12} /> {apt.location}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge and Action */}
                  <div style={{ flex: '0 1 auto', display: 'flex', alignItems: 'center', gap: spacing.md }}>
                    <span
                      style={{
                        backgroundColor: statusConfig[apt.status].bg,
                        color: statusConfig[apt.status].color,
                        padding: `4px ${spacing.sm}`,
                        borderRadius: borderRadius.full,
                        fontSize: typography.fontSize.xs,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {statusConfig[apt.status].label}
                    </span>
                    <ChevronRight size={20} style={{ color: colors.textMuted, opacity: 0.5 }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </RootLayout>
  );
};
