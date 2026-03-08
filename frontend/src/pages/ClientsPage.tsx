import { motion } from 'framer-motion';
import { Users, Phone, Mail, Car } from 'lucide-react';
import { RootLayout } from '../shared/layouts/RootLayout';
import { Card } from '../shared';
import { colors, spacing, typography, borderRadius } from '../shared/design/tokens';

const clients = [
  { name: 'Ana Torres', email: 'ana@email.com', phone: '+51 999 222 111', vehicle: 'Mazda CX-5' },
  { name: 'Carlos Mendoza', email: 'carlos@email.com', phone: '+51 988 120 445', vehicle: 'Toyota Hilux' },
  { name: 'Maria Vega', email: 'maria@email.com', phone: '+51 944 876 230', vehicle: 'Hyundai Tucson' },
  { name: 'Jose Ramirez', email: 'jose@email.com', phone: '+51 977 315 421', vehicle: 'Kia Sportage' },
];

export const ClientsPage = () => {
  return (
    <RootLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={{ margin: 0, fontSize: typography.fontSize['3xl'], color: colors.textDark }}>Clientes</h2>
          <p style={{ margin: `${spacing.sm} 0 0 0`, color: colors.textLight }}>Vista visual para gestion de cartera y contacto rapido.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: spacing.lg }}>
          {clients.map((client, index) => (
            <motion.div key={client.email} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: borderRadius.full, display: 'grid', placeItems: 'center', background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`, color: colors.textWhite, fontWeight: 700 }}>
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: colors.textDark, fontSize: typography.fontSize.lg }}>{client.name}</h3>
                    <span style={{ color: colors.textMuted, fontSize: typography.fontSize.sm }}>Cliente recurrente</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: spacing.sm }}>
                  <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.textLight, fontSize: typography.fontSize.sm }}>
                    <Mail size={14} /> {client.email}
                  </p>
                  <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.textLight, fontSize: typography.fontSize.sm }}>
                    <Phone size={14} /> {client.phone}
                  </p>
                  <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.textLight, fontSize: typography.fontSize.sm }}>
                    <Car size={14} /> {client.vehicle}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <Users size={20} color={colors.primary} />
            <p style={{ margin: 0, color: colors.textLight }}>
              Interfaz lista para conectar con <code>/api/v1/customers</code> en la fase de integracion.
            </p>
          </div>
        </Card>
      </div>
    </RootLayout>
  );
};
