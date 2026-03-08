import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Sparkles, Shield, Zap, Briefcase, Clock, DollarSign, Plus, Edit, Trash2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { RootLayout } from '../shared/layouts/RootLayout';
import { Card } from '../shared';
import { colors, spacing, typography, borderRadius, shadows } from '../shared/design/tokens';
import { servicesApi, type Service } from '../modules/services';
import { ServiceFormModal } from './components/ServiceFormModal';
import type { LucideIcon } from 'lucide-react';

// Map service icons based on name or category
const getServiceIcon = (serviceName: string): LucideIcon => {
  const name = serviceName.toLowerCase();
  if (name.includes('wash') || name.includes('lavado')) return Droplets;
  if (name.includes('ceramic') || name.includes('ceramica')) return Shield;
  if (name.includes('protection') || name.includes('protec')) return Zap;
  if (name.includes('interior') || name.includes('vacuum')) return Briefcase;
  if (name.includes('leather') || name.includes('cuero')) return Sparkles;
  if (name.includes('detail')) return Sparkles;
  return Droplets; // default
};

const categories = [
  { label: 'Todos', value: 'all', id: null },
];

export const ServicesPage = () => {
  const figmaBlue = '#2563eb';
  
  // State management
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [hoveredServiceId, setHoveredServiceId] = useState<number | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Fetch services on mount and when category changes
  useEffect(() => {
    loadServices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = selectedCategory ? { category_id: selectedCategory } : undefined;
      const data = await servicesApi.getAll(params);
      
      setServices(data);
    } catch (err: any) {
      console.error('Error loading services:', err);
      setError(err.response?.data?.error?.message || 'Error al cargar servicios. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
    
    try {
      await servicesApi.delete(id);
      // Remove from local state
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      console.error('Error deleting service:', err);
      alert(err.response?.data?.error?.message || 'Error al eliminar servicio');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleFormSuccess = () => {
    loadServices(); // Reload services after create/update
  };

  const filteredServices = useMemo(() => {
    return services.filter(s => s.is_active);
  }, [services]);

  const getCategoryBadge = (categoryName: string | undefined) => {
    if (!categoryName) return { label: 'Sin Categoria', bg: '#e5e7eb', color: '#374151' };
    
    const name = categoryName.toLowerCase();
    if (name.includes('premium')) return { label: 'Premium', bg: '#fef3c7', color: '#92400e' };
    if (name.includes('special') || name.includes('especial')) return { label: 'Special', bg: '#f3e8ff', color: '#6b21a8' };
    if (name.includes('basic') || name.includes('basico')) return { label: 'Basic', bg: '#dbeafe', color: '#1e40af' };
    
    return { label: categoryName, bg: '#e5e7eb', color: '#374151' };
  };

  const getIconGradient = (categoryName: string | undefined) => {
    if (!categoryName) return 'linear-gradient(135deg, #6b7280, #9ca3af)';
    
    const name = categoryName.toLowerCase();
    if (name.includes('premium')) return 'linear-gradient(135deg, #f59e0b, #fb923c)';
    if (name.includes('special') || name.includes('especial')) return 'linear-gradient(135deg, #a855f7, #ec4899)';
    return 'linear-gradient(135deg, #3b82f6, #22d3ee)';
  };

  return (
    <RootLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.lg, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: typography.fontSize['3xl'], color: colors.textDark, fontFamily: typography.fontFamily.display }}>Catalogo de Servicios</h2>
            <p style={{ margin: `${spacing.sm} 0 0 0`, color: colors.textLight }}>Gestiona todos los servicios de autodetailing con enfoque comercial.</p>
          </div>
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenCreateModal}
            style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.sm, border: 'none', borderRadius: borderRadius.lg, padding: `${spacing.md} ${spacing.lg}`, background: 'linear-gradient(135deg, #0284c7, #06b6d4)', color: colors.textWhite, fontWeight: 700, cursor: 'pointer', boxShadow: shadows.glow }}
          >
            <motion.span whileHover={{ rotate: 90 }} transition={{ duration: 0.22 }} style={{ display: 'inline-flex' }}>
              <Plus size={16} />
            </motion.span>
            Nuevo Servicio
          </motion.button>
        </div>

        {/* Category Filter */}
        <Card variant="elevated">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center' }}>
            <span style={{ color: colors.textLight, fontSize: typography.fontSize.sm, fontWeight: 700 }}>Categoria:</span>
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.id)}
                disabled={isLoading}
                style={{
                  border: 'none',
                  borderRadius: borderRadius.lg,
                  padding: `${spacing.sm} ${spacing.md}`,
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  color: selectedCategory === category.id ? colors.textWhite : colors.textLight,
                  background: selectedCategory === category.id ? 'linear-gradient(135deg, #0284c7, #06b6d4)' : colors.backgroundLighter,
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                <Loader2 size={48} color={figmaBlue} />
              </motion.div>
              <p style={{ marginTop: spacing.md, color: colors.textLight }}>Cargando servicios...</p>
            </motion.div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="elevated" style={{ borderColor: '#fca5a5', background: '#fef2f2' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.md, padding: spacing.xl }}>
                <AlertCircle size={48} color="#dc2626" />
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: 0, color: '#b91c1c', fontFamily: typography.fontFamily.display }}>Error al cargar servicios</h3>
                  <p style={{ margin: `${spacing.sm} 0 0 0`, color: '#991b1b' }}>{error}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadServices}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    border: 'none',
                    borderRadius: borderRadius.lg,
                    padding: `${spacing.sm} ${spacing.lg}`,
                    background: '#dc2626',
                    color: colors.textWhite,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={16} />
                  Reintentar
                </motion.button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="elevated">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.md, padding: spacing.xl }}>
                <Briefcase size={48} color={colors.textLight} />
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: 0, color: colors.textDark, fontFamily: typography.fontFamily.display }}>No hay servicios disponibles</h3>
                  <p style={{ margin: `${spacing.sm} 0 0 0`, color: colors.textLight }}>Crea tu primer servicio para comenzar.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Services Grid */}
        {!isLoading && !error && filteredServices.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: spacing.lg }}>
            {filteredServices.map((service, index) => {
              const Icon = getServiceIcon(service.name);
              const badge = getCategoryBadge(service.category_name);
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 22, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }}
                  whileHover={{
                    y: -10,
                    scale: 1.015,
                  }}
                  onHoverStart={() => setHoveredServiceId(service.id)}
                  onHoverEnd={() => setHoveredServiceId(null)}
                  style={{ borderRadius: borderRadius.xl }}
                >
                  <Card
                    variant="elevated"
                    style={{
                      boxShadow:
                        hoveredServiceId === service.id
                          ? '0 34px 52px -30px rgba(2, 132, 199, 0.38), 0 16px 28px -20px rgba(15, 23, 42, 0.34)'
                          : shadows.lg,
                      borderColor: hoveredServiceId === service.id ? '#bfdbfe' : colors.border,
                      transition: 'box-shadow 220ms ease, border-color 220ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} style={{ width: '52px', height: '52px', borderRadius: borderRadius.xl, background: getIconGradient(service.category_name), display: 'grid', placeItems: 'center', boxShadow: shadows.lg }}>
                          <Icon size={24} color={colors.textWhite} />
                        </motion.div>
                        <span style={{ fontSize: typography.fontSize.xs, padding: `3px ${spacing.sm}`, borderRadius: borderRadius.full, fontWeight: 700, background: badge.bg, color: badge.color }}>
                          {badge.label}
                        </span>
                      </div>

                      <div>
                        <h3 style={{ margin: 0, fontSize: typography.fontSize.lg, color: hoveredServiceId === service.id ? figmaBlue : colors.textDark, transition: 'color 180ms ease', fontFamily: typography.fontFamily.display }}>{service.name}</h3>
                        <p style={{ margin: `${spacing.sm} 0 0 0`, color: colors.textLight, fontSize: typography.fontSize.sm }}>{service.description || 'Sin descripción'}</p>
                      </div>

                      <div style={{ display: 'grid', gap: spacing.sm }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.sm, borderRadius: borderRadius.lg, background: colors.backgroundLighter }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xs, fontSize: typography.fontSize.sm, color: colors.textLight }}><Clock size={14} /> Duracion</span>
                          <strong style={{ color: colors.textDark }}>{service.estimated_duration_minutes} min</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.sm, borderRadius: borderRadius.lg, background: '#ecfdf5', border: '1px solid #bbf7d0' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xs, fontSize: typography.fontSize.sm, color: '#047857' }}><DollarSign size={14} /> Precio</span>
                          <strong style={{ color: '#047857', fontSize: typography.fontSize.lg }}>${service.base_price}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: spacing.sm }}>
                        <motion.button
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleOpenEditModal(service)}
                          style={{ flex: 1, border: 'none', borderRadius: borderRadius.lg, padding: `${spacing.sm} ${spacing.md}`, background: colors.primary, color: colors.textWhite, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: spacing.xs, boxShadow: shadows.md }}
                        >
                          <motion.span whileHover={{ rotate: -12 }} transition={{ duration: 0.2 }} style={{ display: 'inline-flex' }}>
                            <Edit size={14} />
                          </motion.span>
                          Editar
                        </motion.button>
                        <motion.button
                          whileHover={{ y: -2, scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleDelete(service.id)}
                          style={{ border: 'none', borderRadius: borderRadius.lg, padding: `${spacing.sm} ${spacing.md}`, background: '#fee2e2', color: '#b91c1c', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                          <motion.span whileHover={{ rotate: 12 }} transition={{ duration: 0.2 }} style={{ display: 'inline-flex' }}>
                            <Trash2 size={14} />
                          </motion.span>
                        </motion.button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Statistics Panel */}
        {!isLoading && !error && filteredServices.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: colors.textWhite, borderRadius: borderRadius.xl, padding: spacing.xl, boxShadow: shadows.xl }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: spacing.lg }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: typography.fontSize['2xl'], fontFamily: typography.fontFamily.display }}>{filteredServices.length}</p>
                  <p style={{ margin: `${spacing.xs} 0 0 0`, color: '#cbd5e1', fontSize: typography.fontSize.sm }}>Total Servicios</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: typography.fontSize['2xl'], fontFamily: typography.fontFamily.display }}>${filteredServices.reduce((acc, item) => acc + Number(item.base_price), 0).toFixed(0)}</p>
                  <p style={{ margin: `${spacing.xs} 0 0 0`, color: '#cbd5e1', fontSize: typography.fontSize.sm }}>Valor Total</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: typography.fontSize['2xl'], fontFamily: typography.fontFamily.display }}>{filteredServices.length > 0 ? Math.round(filteredServices.reduce((acc, item) => acc + Number(item.estimated_duration_minutes), 0) / filteredServices.length) : 0} min</p>
                  <p style={{ margin: `${spacing.xs} 0 0 0`, color: '#cbd5e1', fontSize: typography.fontSize.sm }}>Duracion Promedio</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: typography.fontSize['2xl'], fontFamily: typography.fontFamily.display }}>${filteredServices.length > 0 ? Math.round(filteredServices.reduce((acc, item) => acc + Number(item.base_price), 0) / filteredServices.length) : 0}</p>
                  <p style={{ margin: `${spacing.xs} 0 0 0`, color: '#cbd5e1', fontSize: typography.fontSize.sm }}>Precio Promedio</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Service Form Modal */}
      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleFormSuccess}
        service={editingService}
      />
    </RootLayout>
  );
};
