import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Plus, Phone, Mail, Car, DollarSign, Calendar, TrendingUp, Award, Eye, Edit } from 'lucide-react';
import { RootLayout } from '../shared/layouts/RootLayout';
import { Card } from '../shared';
import { colors, spacing, typography, borderRadius, shadows } from '../shared/design/tokens';

const clientsData = [
  { id: '1', name: 'Ana Torres', email: 'ana@email.com', phone: '+51 999 222 111', vehicleModel: 'Mazda CX-5', vehiclePlate: 'BOP-3102', totalVisits: 15, totalSpent: 2100, lastVisit: '2026-03-02' },
  { id: '2', name: 'Carlos Mendoza', email: 'carlos@email.com', phone: '+51 988 120 445', vehicleModel: 'Toyota Hilux', vehiclePlate: 'APX-2841', totalVisits: 12, totalSpent: 1850, lastVisit: '2026-03-05' },
  { id: '3', name: 'Maria Vega', email: 'maria@email.com', phone: '+51 944 876 230', vehicleModel: 'Hyundai Tucson', vehiclePlate: 'DOP-5321', totalVisits: 8, totalSpent: 1200, lastVisit: '2026-03-06' },
  { id: '4', name: 'Jose Ramirez', email: 'jose@email.com', phone: '+51 977 315 421', vehicleModel: 'Kia Sportage', vehiclePlate: 'COP-4215', totalVisits: 5, totalSpent: 750, lastVisit: '2026-02-28' },
];

export const ClientsPage = () => {
  const figmaBlue = '#2563eb';
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null);

  const filteredClients = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return clientsData.filter((client) =>
      client.name.toLowerCase().includes(q) ||
      client.email.toLowerCase().includes(q) ||
      client.vehicleModel.toLowerCase().includes(q) ||
      client.vehiclePlate.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalRevenue = clientsData.reduce((acc, client) => acc + client.totalSpent, 0);
  const totalVisits = clientsData.reduce((acc, client) => acc + client.totalVisits, 0);
  const avgSpent = Math.round(totalRevenue / clientsData.length);

  const getTier = (totalSpent: number) => {
    if (totalSpent >= 2000) return { label: 'VIP', avatar: 'linear-gradient(135deg, #f59e0b, #fb923c)', badgeBg: '#fef3c7', badgeColor: '#92400e' };
    if (totalSpent >= 1000) return { label: 'Premium', avatar: 'linear-gradient(135deg, #a855f7, #ec4899)', badgeBg: '#f3e8ff', badgeColor: '#6b21a8' };
    return { label: 'Regular', avatar: 'linear-gradient(135deg, #3b82f6, #22d3ee)', badgeBg: '#dbeafe', badgeColor: '#1e40af' };
  };

  return (
    <RootLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={{ margin: 0, fontSize: typography.fontSize['3xl'], fontFamily: typography.fontFamily.display, color: colors.textDark }}>Gestion de Clientes</h2>
          <p style={{ margin: `${spacing.sm} 0 0 0`, color: colors.textLight }}>Administra relaciones, historial y valor de cada cliente.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: spacing.md }}>
          {[
            { label: 'Total Clientes', value: `${clientsData.length}`, icon: Users, bg: 'linear-gradient(135deg, #eff6ff, #ecfeff)', iconBg: 'linear-gradient(135deg, #3b82f6, #22d3ee)' },
            { label: 'Ingresos Totales', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, bg: 'linear-gradient(135deg, #ecfdf5, #ecfeff)', iconBg: 'linear-gradient(135deg, #22c55e, #34d399)' },
            { label: 'Visitas Totales', value: `${totalVisits}`, icon: Calendar, bg: 'linear-gradient(135deg, #faf5ff, #fdf2f8)', iconBg: 'linear-gradient(135deg, #a855f7, #ec4899)' },
            { label: 'Gasto Promedio', value: `$${avgSpent}`, icon: TrendingUp, bg: 'linear-gradient(135deg, #fff7ed, #fef2f2)', iconBg: 'linear-gradient(135deg, #f97316, #ef4444)' },
          ].map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -5, scale: 1.01 }}
                transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1], delay: idx * 0.06 }}
              >
                <Card>
                  <div style={{ padding: spacing.lg, borderRadius: borderRadius.xl, background: metric.bg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: 0, color: colors.textLight, fontSize: typography.fontSize.sm }}>{metric.label}</p>
                        <p style={{ margin: `${spacing.sm} 0 0 0`, fontWeight: 700, color: colors.textDark, fontFamily: typography.fontFamily.display, fontSize: typography.fontSize['2xl'] }}>{metric.value}</p>
                      </div>
                      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} style={{ width: '44px', height: '44px', borderRadius: borderRadius.lg, background: metric.iconBg, display: 'grid', placeItems: 'center' }}>
                        <Icon size={20} color={colors.textWhite} />
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '680px' }}>
            <Search size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: colors.textMuted }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar clientes por nombre, email, vehiculo o placa"
              style={{ width: '100%', border: `1px solid ${colors.border}`, borderRadius: borderRadius.lg, padding: `10px 12px 10px 36px`, fontSize: typography.fontSize.sm, background: colors.background, outline: 'none' }}
            />
          </div>
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.sm, border: 'none', borderRadius: borderRadius.lg, padding: `${spacing.md} ${spacing.lg}`, background: 'linear-gradient(135deg, #0284c7, #06b6d4)', color: colors.textWhite, fontWeight: 700, cursor: 'pointer', boxShadow: shadows.glow }}
          >
            <motion.span whileHover={{ rotate: 90 }} transition={{ duration: 0.22 }} style={{ display: 'inline-flex' }}>
              <Plus size={16} />
            </motion.span>
            Nuevo Cliente
          </motion.button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: spacing.lg }}>
          {filteredClients.map((client, idx) => {
            const tier = getTier(client.totalSpent);
            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1], delay: idx * 0.07 }}
                whileHover={{ y: -7, scale: 1.01 }}
                onHoverStart={() => setHoveredClientId(client.id)}
                onHoverEnd={() => setHoveredClientId(null)}
              >
                <Card variant="elevated">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: borderRadius.xl, background: tier.avatar, display: 'grid', placeItems: 'center', color: colors.textWhite, fontWeight: 700 }}>
                          {client.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h3 style={{ margin: 0, color: hoveredClientId === client.id ? figmaBlue : colors.textDark, transition: 'color 180ms ease', fontSize: typography.fontSize.lg, fontFamily: typography.fontFamily.display }}>{client.name}</h3>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: spacing.xs, background: tier.badgeBg, color: tier.badgeColor, borderRadius: borderRadius.full, padding: `3px ${spacing.sm}`, fontSize: typography.fontSize.xs, fontWeight: 700 }}>
                            <Award size={12} /> {tier.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: spacing.sm, color: colors.textLight, fontSize: typography.fontSize.sm }}>
                      <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: spacing.sm }}><Mail size={14} /> {client.email}</p>
                      <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: spacing.sm }}><Phone size={14} /> {client.phone}</p>
                      <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: spacing.sm }}><Car size={14} /> {client.vehicleModel} <span style={{ padding: `2px ${spacing.sm}`, borderRadius: borderRadius.md, background: colors.backgroundLighter, color: colors.textMuted, fontSize: typography.fontSize.xs }}>{client.vehiclePlate}</span></p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.sm }}>
                      <div style={{ background: '#eff6ff', borderRadius: borderRadius.lg, padding: spacing.sm, textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: typography.fontSize.xs, color: '#2563eb' }}>Visitas</p>
                        <p style={{ margin: `${spacing.xs} 0 0 0`, fontWeight: 700, color: '#1d4ed8' }}>{client.totalVisits}</p>
                      </div>
                      <div style={{ background: '#ecfdf5', borderRadius: borderRadius.lg, padding: spacing.sm, textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: typography.fontSize.xs, color: '#059669' }}>Gastado</p>
                        <p style={{ margin: `${spacing.xs} 0 0 0`, fontWeight: 700, color: '#047857' }}>${client.totalSpent}</p>
                      </div>
                      <div style={{ background: '#faf5ff', borderRadius: borderRadius.lg, padding: spacing.sm, textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: typography.fontSize.xs, color: '#9333ea' }}>Promedio</p>
                        <p style={{ margin: `${spacing.xs} 0 0 0`, fontWeight: 700, color: '#7e22ce' }}>${Math.round(client.totalSpent / client.totalVisits)}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: borderRadius.lg, background: colors.backgroundLight, padding: spacing.md }}>
                      <span style={{ color: colors.textLight, fontSize: typography.fontSize.sm }}>Ultima visita</span>
                      <strong style={{ fontSize: typography.fontSize.sm, color: colors.textDark }}>{new Date(client.lastVisit).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: spacing.sm }}>
                      <motion.button
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ flex: 1, border: 'none', background: colors.primary, color: colors.textWhite, borderRadius: borderRadius.lg, padding: `${spacing.sm} ${spacing.md}`, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: spacing.xs }}
                      >
                        <motion.span whileHover={{ rotate: -10 }} transition={{ duration: 0.2 }} style={{ display: 'inline-flex' }}><Eye size={14} /></motion.span>
                        Ver Perfil
                      </motion.button>
                      <motion.button
                        whileHover={{ y: -2, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        style={{ border: 'none', background: colors.textLight, color: colors.textWhite, borderRadius: borderRadius.lg, padding: `${spacing.sm} ${spacing.md}`, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <motion.span whileHover={{ rotate: 10 }} transition={{ duration: 0.2 }} style={{ display: 'inline-flex' }}><Edit size={14} /></motion.span>
                      </motion.button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </RootLayout>
  );
};
