import { CSSProperties, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Car, Plus, Search, Filter, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { RootLayout } from '../shared/layouts/RootLayout';
import { Card } from '../shared';
import { colors, spacing, typography, borderRadius, shadows } from '../shared/design/tokens';

const appointmentsData = [
  { id: 'APT-2041', clientName: 'Carlos Mendoza', vehicleModel: 'Toyota Hilux 2022', vehiclePlate: 'APX-2841', serviceName: 'Premium Detailing', date: '2026-03-08', time: '09:00', status: 'confirmed', notes: '' },
  { id: 'APT-2042', clientName: 'Ana Torres', vehicleModel: 'Mazda CX-5 2021', vehiclePlate: 'BOP-3102', serviceName: 'Ceramic Coating', date: '2026-03-08', time: '10:30', status: 'in_progress', notes: 'Cliente espera entrega el mismo dia' },
  { id: 'APT-2043', clientName: 'Jose Ramirez', vehicleModel: 'Kia Sportage 2020', vehiclePlate: 'COP-4215', serviceName: 'Basic Wash', date: '2026-03-08', time: '12:15', status: 'pending', notes: '' },
  { id: 'APT-2044', clientName: 'Maria Vega', vehicleModel: 'Hyundai Tucson 2023', vehiclePlate: 'DOP-5321', serviceName: 'Paint Protection', date: '2026-03-08', time: '15:00', status: 'completed', notes: '' },
];

export const AppointmentsPage = () => {
  const figmaBlue = '#2563eb';
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredAppointmentId, setHoveredAppointmentId] = useState<string | null>(null);

  const filteredAppointments = useMemo(() => {
    return appointmentsData.filter((appointment) => {
      const query = searchQuery.toLowerCase();
      const matchesFilter = filter === 'all' || appointment.status === filter;
      const matchesSearch =
        appointment.clientName.toLowerCase().includes(query) ||
        appointment.vehicleModel.toLowerCase().includes(query) ||
        appointment.vehiclePlate.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  const getStatusStyle = (status: string) => {
    if (status === 'in_progress') {
      return { label: 'En Proceso', bg: '#dcfce7', color: '#166534', border: '#bbf7d0', icon: <Clock size={14} /> };
    }
    if (status === 'pending') {
      return { label: 'Pendiente', bg: '#fef9c3', color: '#854d0e', border: '#fde68a', icon: <AlertCircle size={14} /> };
    }
    if (status === 'completed') {
      return { label: 'Completada', bg: '#d1fae5', color: '#065f46', border: '#a7f3d0', icon: <CheckCircle2 size={14} /> };
    }
    if (status === 'cancelled') {
      return { label: 'Cancelada', bg: '#fee2e2', color: '#991b1b', border: '#fecaca', icon: <XCircle size={14} /> };
    }
    return { label: 'Confirmada', bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe', icon: <Calendar size={14} /> };
  };

  const filterButtons = [
    { label: 'Todas', value: 'all' },
    { label: 'Pendientes', value: 'pending' },
    { label: 'Confirmadas', value: 'confirmed' },
    { label: 'En Proceso', value: 'in_progress' },
    { label: 'Completadas', value: 'completed' },
  ];

  const actionButtonBaseStyles: CSSProperties = {
    border: 'none',
    borderRadius: borderRadius.lg,
    padding: `${spacing.sm} ${spacing.md}`,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: typography.fontSize.sm,
    minWidth: '122px',
    minHeight: '38px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  };

  return (
    <RootLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '720px' }}>
            <Search size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: colors.textMuted }} />
            <input
              placeholder="Buscar por cliente, vehiculo o placa"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', borderRadius: borderRadius.lg, border: `1px solid ${colors.border}`, padding: `10px 12px 10px 36px`, fontSize: typography.fontSize.sm, background: colors.background, outline: 'none' }}
            />
          </div>
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ border: 'none', borderRadius: borderRadius.lg, padding: `${spacing.md} ${spacing.lg}`, background: 'linear-gradient(135deg, #0284c7, #06b6d4)', color: colors.textWhite, fontWeight: 700, cursor: 'pointer', boxShadow: shadows.glow, display: 'inline-flex', alignItems: 'center', gap: spacing.sm }}
          >
            <motion.span whileHover={{ rotate: 90 }} transition={{ duration: 0.22 }} style={{ display: 'inline-flex' }}>
              <Plus size={16} />
            </motion.span>
            Nueva Cita
          </motion.button>
        </div>

        <Card variant="elevated">
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={16} color={colors.textLight} />
            <span style={{ color: colors.textLight, fontSize: typography.fontSize.sm, fontWeight: 700 }}>Filtrar:</span>
            {filterButtons.map((button) => (
              <button
                key={button.value}
                onClick={() => setFilter(button.value)}
                style={{
                  border: 'none',
                  borderRadius: borderRadius.lg,
                  padding: `${spacing.sm} ${spacing.md}`,
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: filter === button.value ? colors.textWhite : colors.textLight,
                  background: filter === button.value ? 'linear-gradient(135deg, #0284c7, #06b6d4)' : colors.backgroundLighter,
                }}
              >
                {button.label}
              </button>
            ))}
          </div>
        </Card>

        <div style={{ display: 'grid', gap: spacing.md }}>
          {filteredAppointments.map((appointment, index) => {
            const status = getStatusStyle(appointment.status);
            return (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 22, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
                whileHover={{ y: -6, scale: 1.008 }}
                onHoverStart={() => setHoveredAppointmentId(appointment.id)}
                onHoverEnd={() => setHoveredAppointmentId(null)}
              >
                <Card variant="elevated">
                  <div style={{ display: 'flex', gap: spacing.lg, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, minWidth: '220px' }}>
                      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} style={{ width: '56px', height: '56px', borderRadius: borderRadius.xl, background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', display: 'grid', placeItems: 'center', boxShadow: shadows.lg }}>
                        <Car size={24} color={colors.textWhite} />
                      </motion.div>
                      <div>
                        <h3 style={{ margin: 0, color: hoveredAppointmentId === appointment.id ? figmaBlue : colors.textDark, transition: 'color 180ms ease', fontSize: typography.fontSize.lg, fontFamily: typography.fontFamily.display }}>{appointment.clientName}</h3>
                        <p style={{ margin: `${spacing.xs} 0 0 0`, color: colors.textLight, fontSize: typography.fontSize.sm }}>{appointment.vehicleModel}</p>
                        <span style={{ marginTop: spacing.xs, display: 'inline-block', padding: `2px ${spacing.sm}`, borderRadius: borderRadius.md, background: colors.backgroundLighter, fontSize: typography.fontSize.xs, color: colors.textMuted }}>{appointment.vehiclePlate}</span>
                      </div>
                    </div>

                    <div style={{ flex: '1 1 240px', minWidth: '240px', display: 'grid', gap: spacing.sm }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xs, background: status.bg, color: status.color, border: `1px solid ${status.border}`, borderRadius: borderRadius.full, padding: `4px ${spacing.sm}`, fontWeight: 700, fontSize: typography.fontSize.xs }}>
                          {status.icon} {status.label}
                        </span>
                        <span style={{ background: '#f3e8ff', color: '#6b21a8', borderRadius: borderRadius.full, padding: `4px ${spacing.sm}`, fontSize: typography.fontSize.xs, fontWeight: 700 }}>{appointment.serviceName}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(120px, 1fr))', gap: spacing.sm }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xs, color: colors.textLight, fontSize: typography.fontSize.sm }}><Calendar size={14} /> {new Date(appointment.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xs, color: colors.textLight, fontSize: typography.fontSize.sm }}><Clock size={14} /> {appointment.time}</span>
                      </div>
                      {appointment.notes ? (
                        <div style={{ border: '1px solid #fde68a', background: '#fef9c3', borderRadius: borderRadius.lg, padding: spacing.sm, color: '#854d0e', fontSize: typography.fontSize.xs }}>
                          <strong>Nota:</strong> {appointment.notes}
                        </div>
                      ) : null}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                      <motion.button
                        whileHover={{ scale: 1.04, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          ...actionButtonBaseStyles,
                          background: '#16a34a',
                          color: colors.textWhite,
                          boxShadow: '0 8px 16px -10px rgba(22, 163, 74, 0.9)',
                          transition: 'background-color 160ms ease, box-shadow 160ms ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#15803d';
                          e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(21, 128, 61, 0.95)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#16a34a';
                          e.currentTarget.style.boxShadow = '0 8px 16px -10px rgba(22, 163, 74, 0.9)';
                        }}
                      >
                        <motion.span
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.35 }}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: borderRadius.full,
                            background: 'rgba(255,255,255,0.95)',
                            boxShadow: '0 0 0 3px rgba(255,255,255,0.25)',
                          }}
                        />
                        Completar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          ...actionButtonBaseStyles,
                          background: colors.textLight,
                          color: colors.textWhite,
                          boxShadow: shadows.sm,
                        }}
                      >
                        Ver Detalles
                      </motion.button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredAppointments.length === 0 ? (
          <Card variant="elevated">
            <div style={{ textAlign: 'center', padding: spacing.xl }}>
              <Calendar size={42} color={colors.textMuted} />
              <h3 style={{ margin: `${spacing.md} 0 0 0`, color: colors.textDark, fontFamily: typography.fontFamily.display }}>No se encontraron citas</h3>
              <p style={{ margin: `${spacing.sm} 0 0 0`, color: colors.textLight }}>Ajusta los filtros o la busqueda.</p>
            </div>
          </Card>
        ) : null}
      </div>
    </RootLayout>
  );
};
