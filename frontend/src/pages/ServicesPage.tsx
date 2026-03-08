import { motion } from 'framer-motion';
import { Wrench, TimerReset, Droplets, Sparkles } from 'lucide-react';
import { RootLayout } from '../shared/layouts/RootLayout';
import { Card, Button } from '../shared';
import { colors, spacing, typography, borderRadius } from '../shared/design/tokens';

const services = [
  { name: 'Basic Wash', category: 'Basic', price: '$250', duration: '45 min' },
  { name: 'Premium Detailing', category: 'Premium', price: '$750', duration: '180 min' },
  { name: 'Ceramic Coating', category: 'Special', price: '$1200', duration: '240 min' },
  { name: 'Paint Protection', category: 'Premium', price: '$500', duration: '120 min' },
  { name: 'Interior Vacuum', category: 'Basic', price: '$100', duration: '30 min' },
  { name: 'Leather Treatment', category: 'Special', price: '$300', duration: '90 min' },
];

export const ServicesPage = () => {
  return (
    <RootLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: spacing.lg }}>
          <div>
            <h2 style={{ margin: 0, fontSize: typography.fontSize['3xl'], color: colors.textDark }}>Catalogo de Servicios</h2>
            <p style={{ margin: `${spacing.sm} 0 0 0`, color: colors.textLight }}>Diseño visual del menu de servicios con foco comercial.</p>
          </div>
          <Button>Nuevo servicio</Button>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: spacing.lg }}>
          {services.map((service, idx) => (
            <motion.div key={service.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}>
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: borderRadius.lg, display: 'grid', placeItems: 'center', background: `linear-gradient(145deg, ${colors.primary} 0%, ${colors.accent} 100%)`, color: colors.textWhite }}>
                    <Wrench size={18} />
                  </div>
                  <span style={{ fontSize: typography.fontSize.xs, color: colors.primaryDark, background: colors.infoBg, padding: '5px 9px', borderRadius: borderRadius.full, fontWeight: 700 }}>{service.category}</span>
                </div>
                <h3 style={{ margin: 0, color: colors.textDark }}>{service.name}</h3>
                <div style={{ display: 'grid', gap: spacing.sm, marginTop: spacing.lg }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textLight, fontSize: typography.fontSize.sm }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}><Droplets size={14} />Precio</span>
                    <strong style={{ color: colors.textDark }}>{service.price}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textLight, fontSize: typography.fontSize.sm }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}><TimerReset size={14} />Duracion</span>
                    <strong style={{ color: colors.textDark }}>{service.duration}</strong>
                  </div>
                </div>
                <button style={{ marginTop: spacing.lg, width: '100%', border: 'none', background: colors.backgroundLight, color: colors.textDark, borderRadius: borderRadius.lg, padding: '10px', fontWeight: 600, cursor: 'pointer' }}>
                  Ver detalle
                </button>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card variant="outlined">
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <Sparkles size={18} color={colors.primary} />
            <p style={{ margin: 0, color: colors.textLight }}>
              Puedes conectar esta vista al endpoint <code>/api/v1/services</code> en la Fase 7 manteniendo este estilo visual.
            </p>
          </div>
        </Card>
      </div>
    </RootLayout>
  );
};
