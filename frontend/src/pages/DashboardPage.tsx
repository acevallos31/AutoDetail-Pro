import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Car,
} from 'lucide-react';
import { RootLayout } from '../shared/layouts/RootLayout';
import { Card } from '../shared';
import { colors, spacing, typography, shadows, borderRadius } from '../shared/design/tokens';

export const DashboardPage = () => {
  const figmaBlue = '#2563eb';
  const figmaBlueStrong = '#1d4ed8';
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<'appointments' | 'services' | null>(null);

  const statCards = [
    {
      title: 'Citas Hoy',
      value: '12',
      change: '+12%',
      icon: Calendar,
      gradient: 'linear-gradient(135deg, #3b82f6, #22d3ee)',
      bgGradient: 'linear-gradient(135deg, #eff6ff, #ecfeff)',
    },
    {
      title: 'Ingresos Semanal',
      value: '$3,250',
      change: '+8%',
      icon: DollarSign,
      gradient: 'linear-gradient(135deg, #22c55e, #34d399)',
      bgGradient: 'linear-gradient(135deg, #ecfdf5, #ecfeff)',
    },
    {
      title: 'Clientes Totales',
      value: '48',
      change: '+15%',
      icon: Users,
      gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
      bgGradient: 'linear-gradient(135deg, #faf5ff, #fdf2f8)',
    },
    {
      title: 'Ingresos Mensual',
      value: '$12,500',
      change: '+23%',
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
      bgGradient: 'linear-gradient(135deg, #fff7ed, #fef2f2)',
    },
  ];

  const appointments = [
    { id: '1', clientName: 'Carlos Mendoza', serviceName: 'Premium Detailing', vehicleModel: 'Toyota Hilux', vehiclePlate: 'APX-2841', time: '09:00', status: 'confirmed' },
    { id: '2', clientName: 'Ana Torres', serviceName: 'Ceramic Coating', vehicleModel: 'Mazda CX-5', vehiclePlate: 'BOP-3102', time: '10:30', status: 'in_progress' },
    { id: '3', clientName: 'Jose Ramirez', serviceName: 'Basic Wash', vehicleModel: 'Kia Sportage', vehiclePlate: 'COP-4215', time: '12:15', status: 'pending' },
  ];

  const services = [
    { id: '1', name: 'Premium Detailing', price: 750, duration: 180, category: 'Premium' },
    { id: '2', name: 'Ceramic Coating', price: 1200, duration: 240, category: 'Special' },
    { id: '3', name: 'Paint Protection', price: 500, duration: 120, category: 'Premium' },
  ];

  const getStatusBadgeStyle = (status: string) => {
    if (status === 'in_progress') return { bg: '#dcfce7', color: '#166534', border: '#bbf7d0', icon: <Clock size={13} /> };
    if (status === 'pending') return { bg: '#fef9c3', color: '#854d0e', border: '#fde68a', icon: <AlertCircle size={13} /> };
    return { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe', icon: <CheckCircle2 size={13} /> };
  };

  return (
    <RootLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: spacing.lg }}>
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -8, scale: 1.012, boxShadow: '0 24px 44px -22px rgba(2, 132, 199, 0.45)' }}
                transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
                onHoverStart={() => setHoveredStat(stat.title)}
                onHoverEnd={() => setHoveredStat(null)}
                style={{ borderRadius: borderRadius.xl }}
              >
                <Card>
                  <div
                    style={{
                      background: stat.bgGradient,
                      borderRadius: borderRadius.xl,
                      padding: spacing.xl,
                      border: '1px solid rgba(255,255,255,0.7)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: typography.fontSize.sm, color: hoveredStat === stat.title ? figmaBlueStrong : colors.textLight, transition: 'color 180ms ease' }}>{stat.title}</p>
                        <h3 style={{ margin: `${spacing.sm} 0`, fontSize: typography.fontSize['3xl'], fontFamily: typography.fontFamily.display, color: hoveredStat === stat.title ? figmaBlue : colors.textDark, transition: 'color 180ms ease' }}>
                          {stat.value}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: typography.fontSize.xs }}>
                          <TrendingUp size={13} color={colors.success} />
                          <span style={{ color: colors.success, fontWeight: 700 }}>{stat.change}</span>
                          <span style={{ color: colors.textMuted }}>vs semana pasada</span>
                        </div>
                      </div>
                      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} style={{ padding: spacing.md, borderRadius: borderRadius.lg, background: stat.gradient, boxShadow: shadows.lg }}>
                        <Icon size={22} color={colors.textWhite} />
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: spacing.lg }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -6, boxShadow: '0 24px 44px -24px rgba(2, 132, 199, 0.42)' }}
            transition={{ delay: 0.35 }}
            onHoverStart={() => setHoveredSection('appointments')}
            onHoverEnd={() => setHoveredSection(null)}
            style={{ borderRadius: borderRadius.xl }}
          >
            <Card variant="elevated">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
                <h3 style={{ margin: 0, fontSize: typography.fontSize.xl, fontFamily: typography.fontFamily.display, color: hoveredSection === 'appointments' ? figmaBlue : colors.textDark, transition: 'color 180ms ease' }}>Citas de Hoy</h3>
                <motion.button whileHover={{ y: -1, scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ border: 'none', background: 'transparent', color: colors.primary, fontWeight: 700, cursor: 'pointer' }}>Ver todas</motion.button>
              </div>
              <div style={{ display: 'grid', gap: spacing.md }}>
                {appointments.map((appointment, index) => {
                  const badge = getStatusBadgeStyle(appointment.status);
                  return (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, x: -16, scale: 0.985 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1], delay: 0.45 + index * 0.08 }}
                      whileHover={{ scale: 1.012, y: -3 }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: spacing.lg,
                        borderRadius: borderRadius.xl,
                        background: 'linear-gradient(90deg, #f8fafc, #f1f5f9)',
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} style={{ width: '44px', height: '44px', borderRadius: borderRadius.lg, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #3b82f6, #22d3ee)' }}>
                          <Car size={20} color={colors.textWhite} />
                        </motion.div>
                        <div>
                          <strong style={{ color: colors.textDark }}>{appointment.clientName}</strong>
                          <p style={{ margin: `${spacing.xs} 0 0 0`, color: colors.textLight, fontSize: typography.fontSize.sm }}>{appointment.serviceName}</p>
                          <p style={{ margin: `${spacing.xs} 0 0 0`, color: colors.textMuted, fontSize: typography.fontSize.xs }}>{appointment.vehicleModel} • {appointment.vehiclePlate}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: `0 0 ${spacing.sm} 0`, fontWeight: 700, color: colors.textDark }}>{appointment.time}</p>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, borderRadius: borderRadius.full, padding: `4px ${spacing.sm}`, fontSize: typography.fontSize.xs, fontWeight: 700 }}>
                          {badge.icon}
                          {appointment.status === 'in_progress' ? 'En Proceso' : appointment.status === 'pending' ? 'Pendiente' : 'Confirmada'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -6, boxShadow: '0 24px 44px -24px rgba(2, 132, 199, 0.42)' }}
            transition={{ delay: 0.5 }}
            onHoverStart={() => setHoveredSection('services')}
            onHoverEnd={() => setHoveredSection(null)}
            style={{ borderRadius: borderRadius.xl }}
          >
            <Card variant="elevated">
              <h3 style={{ margin: `0 0 ${spacing.lg} 0`, fontSize: typography.fontSize.xl, fontFamily: typography.fontFamily.display, color: hoveredSection === 'services' ? figmaBlue : colors.textDark, transition: 'color 180ms ease' }}>Servicios Populares</h3>
              <div style={{ display: 'grid', gap: spacing.md }}>
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.56 + index * 0.08 }}
                    whileHover={{ scale: 1.014, y: -4 }}
                    style={{ padding: spacing.md, borderRadius: borderRadius.lg, border: `1px solid ${colors.border}`, background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: typography.fontSize.sm, color: colors.textDark }}>{service.name}</strong>
                      <span style={{ color: colors.primary, fontWeight: 700 }}>${service.price}</span>
                    </div>
                    <div style={{ marginTop: spacing.xs, display: 'flex', justifyContent: 'space-between', fontSize: typography.fontSize.xs, color: colors.textLight }}>
                      <span>{service.duration} min</span>
                      <span style={{ background: colors.infoBg, color: colors.primaryDark, padding: `2px ${spacing.sm}`, borderRadius: borderRadius.full, fontWeight: 700 }}>{service.category}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <div style={{ background: 'linear-gradient(135deg, #0284c7, #06b6d4)', borderRadius: borderRadius.xl, padding: spacing.xl, color: colors.textWhite, boxShadow: shadows.lg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.lg, flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: typography.fontSize['2xl'], fontFamily: typography.fontFamily.display }}>Listo para crecer tu negocio?</h3>
              <p style={{ margin: `${spacing.sm} 0 0 0`, opacity: 0.9 }}>Gestiona citas, servicios y clientes desde un solo panel.</p>
            </div>
            <motion.button whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.98 }} style={{ background: colors.textWhite, color: colors.primaryDark, border: 'none', borderRadius: borderRadius.lg, padding: `${spacing.md} ${spacing.lg}`, fontWeight: 700, cursor: 'pointer', boxShadow: shadows.md }}>
              Agendar Nueva Cita
            </motion.button>
          </div>
        </motion.div>
      </div>
    </RootLayout>
  );
};
