import { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock3, CircleCheck, CarFront, Search } from 'lucide-react';
import { RootLayout } from '../shared/layouts/RootLayout';
import { Card, Button } from '../shared';
import { colors, spacing, typography, borderRadius, shadows } from '../shared/design/tokens';

const appointments = [
  {
    id: 'APT-2041',
    client: 'Carlos Mendoza',
    vehicle: 'Toyota Hilux 2022',
    time: '09:00',
    status: 'confirmed',
    service: 'Premium Detailing',
  },
  {
    id: 'APT-2042',
    client: 'Ana Torres',
    vehicle: 'Mazda CX-5 2021',
    time: '10:30',
    status: 'in_progress',
    service: 'Ceramic Coating',
  },
  {
    id: 'APT-2043',
    client: 'Jose Ramirez',
    vehicle: 'Kia Sportage 2020',
    time: '12:15',
    status: 'pending',
    service: 'Basic Wash',
  },
  {
    id: 'APT-2044',
    client: 'Maria Vega',
    vehicle: 'Hyundai Tucson 2023',
    time: '15:00',
    status: 'confirmed',
    service: 'Paint Protection',
  },
];

const statusStyles: Record<string, CSSProperties> = {
  confirmed: {
    backgroundColor: colors.infoBg,
    color: colors.info,
  },
  in_progress: {
    backgroundColor: colors.warningBg,
    color: colors.warning,
  },
  pending: {
    backgroundColor: colors.backgroundLighter,
    color: colors.textLight,
  },
};

const statusLabel: Record<string, string> = {
  confirmed: 'Confirmada',
  in_progress: 'En proceso',
  pending: 'Pendiente',
};

export const AppointmentsPage = () => {
  return (
    <RootLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.lg, flexWrap: 'wrap' }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: typography.fontSize['3xl'], fontFamily: typography.fontFamily.display, letterSpacing: '-0.02em', color: colors.textDark }}>Agenda de Citas</h2>
            <p style={{ margin: `${spacing.sm} 0 0 0`, color: colors.textLight }}>Gestion visual de turnos y estado operativo del dia.</p>
          </div>
          <Button size="md">Nueva cita</Button>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: spacing.lg }}>
          {[
            { label: 'Total Hoy', value: '12', icon: CalendarDays },
            { label: 'En Proceso', value: '4', icon: Clock3 },
            { label: 'Completadas', value: '7', icon: CircleCheck },
            { label: 'Vehiculos Activos', value: '5', icon: CarFront },
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div key={metric.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
                <Card>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, color: colors.textMuted, fontSize: typography.fontSize.sm }}>{metric.label}</p>
                      <p style={{ margin: `${spacing.sm} 0 0 0`, fontSize: typography.fontSize['2xl'], fontWeight: 700, color: colors.textDark }}>{metric.value}</p>
                    </div>
                    <div style={{ width: '42px', height: '42px', borderRadius: borderRadius.lg, background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`, display: 'grid', placeItems: 'center', color: colors.textWhite }}>
                      <Icon size={20} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg, gap: spacing.md, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, color: colors.textDark }}>Listado de Citas</h3>
            <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 260px', maxWidth: '360px' }}>
              <Search size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: colors.textMuted }} />
              <input
                placeholder="Buscar por cliente o placa"
                style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: borderRadius.lg, border: `1px solid ${colors.border}`, backgroundColor: 'rgba(255,255,255,0.88)', boxShadow: 'inset 0 1px 2px rgba(15,23,42,0.04)', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gap: spacing.md }}>
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.06 }}
                style={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: borderRadius.xl,
                  padding: spacing.lg,
                  backgroundColor: 'rgba(255,255,255,0.84)',
                  boxShadow: shadows.sm,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: spacing.lg,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'grid', gap: spacing.xs }}>
                  <strong style={{ color: colors.textDark }}>{appointment.client}</strong>
                  <span style={{ color: colors.textLight, fontSize: typography.fontSize.sm }}>{appointment.vehicle}</span>
                  <span style={{ color: colors.textMuted, fontSize: typography.fontSize.sm }}>{appointment.service}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginLeft: 'auto' }}>
                  <span style={{ color: colors.textLight, fontWeight: 600 }}>{appointment.time}</span>
                  <span
                    style={{
                      ...statusStyles[appointment.status],
                      padding: '6px 10px',
                      borderRadius: borderRadius.full,
                      fontSize: typography.fontSize.xs,
                      fontWeight: 700,
                    }}
                  >
                    {statusLabel[appointment.status]}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </RootLayout>
  );
};
