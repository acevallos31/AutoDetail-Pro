import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import { Modal } from '../../shared/components/Modal';
import { colors, spacing, borderRadius, shadows, typography } from '../../shared/design/tokens';
import { servicesApi, type Service, type CreateServiceDTO, type UpdateServiceDTO } from '../../modules/services';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service?: Service | null; // If provided, it's edit mode
}

export const ServiceFormModal = ({ isOpen, onClose, onSuccess, service }: ServiceFormModalProps) => {
  const isEditMode = !!service;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    estimated_duration_minutes: '',
    category_id: '1', // Default to first category
    requires_booth: false,
    requires_drying: false,
    can_be_parallel: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when editing
  useEffect(() => {
    if (service && isOpen) {
      setFormData({
        name: service.name,
        description: service.description || '',
        base_price: service.base_price.toString(),
        estimated_duration_minutes: service.estimated_duration_minutes.toString(),
        category_id: service.category_id.toString(),
        requires_booth: service.requires_booth,
        requires_drying: service.requires_drying,
        can_be_parallel: service.can_be_parallel,
      });
    } else if (!isOpen) {
      // Reset form when closed
      setFormData({
        name: '',
        description: '',
        base_price: '',
        estimated_duration_minutes: '',
        category_id: '1',
        requires_booth: false,
        requires_drying: false,
        can_be_parallel: false,
      });
      setError(null);
    }
  }, [service, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        base_price: parseFloat(formData.base_price),
        estimated_duration_minutes: parseInt(formData.estimated_duration_minutes),
        category_id: parseInt(formData.category_id),
        requires_booth: formData.requires_booth,
        requires_drying: formData.requires_drying,
        can_be_parallel: formData.can_be_parallel,
      };

      if (isEditMode && service) {
        await servicesApi.update(service.id, payload as UpdateServiceDTO);
      } else {
        await servicesApi.create(payload as CreateServiceDTO);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error saving service:', err);
      setError(err.response?.data?.error?.message || 'Error al guardar el servicio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Editar Servicio' : 'Nuevo Servicio'}
      size="md"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: spacing.md,
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: borderRadius.lg,
              color: '#b91c1c',
              fontSize: typography.fontSize.sm,
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Service Name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          <label
            htmlFor="name"
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: 700,
              color: colors.textDark,
            }}
          >
            Nombre del Servicio *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            style={{
              padding: spacing.md,
              border: `1px solid ${colors.border}`,
              borderRadius: borderRadius.lg,
              fontSize: typography.fontSize.base,
              color: colors.textDark,
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.currentTarget.style.borderColor = colors.border)}
            placeholder="ej. Lavado Premium"
          />
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          <label
            htmlFor="description"
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: 700,
              color: colors.textDark,
            }}
          >
            Descripción
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            style={{
              padding: spacing.md,
              border: `1px solid ${colors.border}`,
              borderRadius: borderRadius.lg,
              fontSize: typography.fontSize.base,
              color: colors.textDark,
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.currentTarget.style.borderColor = colors.border)}
            placeholder="Descripción del servicio..."
          />
        </div>

        {/* Price and Duration Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
          {/* Price */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
            <label
              htmlFor="base_price"
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: 700,
                color: colors.textDark,
              }}
            >
              Precio Base * ($)
            </label>
            <input
              id="base_price"
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.base_price}
              onChange={(e) => handleChange('base_price', e.target.value)}
              style={{
                padding: spacing.md,
                border: `1px solid ${colors.border}`,
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSize.base,
                color: colors.textDark,
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onBlur={(e) => (e.currentTarget.style.borderColor = colors.border)}
              placeholder="250.00"
            />
          </div>

          {/* Duration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
            <label
              htmlFor="estimated_duration_minutes"
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: 700,
                color: colors.textDark,
              }}
            >
              Duración * (min)
            </label>
            <input
              id="estimated_duration_minutes"
              type="number"
              required
              min="1"
              step="1"
              value={formData.estimated_duration_minutes}
              onChange={(e) => handleChange('estimated_duration_minutes', e.target.value)}
              style={{
                padding: spacing.md,
                border: `1px solid ${colors.border}`,
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSize.base,
                color: colors.textDark,
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
              onBlur={(e) => (e.currentTarget.style.borderColor = colors.border)}
              placeholder="45"
            />
          </div>
        </div>

        {/* Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          <label
            htmlFor="category_id"
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: 700,
              color: colors.textDark,
            }}
          >
            Categoría *
          </label>
          <select
            id="category_id"
            required
            value={formData.category_id}
            onChange={(e) => handleChange('category_id', e.target.value)}
            style={{
              padding: spacing.md,
              border: `1px solid ${colors.border}`,
              borderRadius: borderRadius.lg,
              fontSize: typography.fontSize.base,
              color: colors.textDark,
              outline: 'none',
              cursor: 'pointer',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.currentTarget.style.borderColor = colors.border)}
          >
            <option value="1">Basic Services</option>
            <option value="2">Premium Services</option>
            <option value="3">Special Services</option>
          </select>
        </div>

        {/* Checkboxes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
          <label
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: 700,
              color: colors.textDark,
            }}
          >
            Características
          </label>
          
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              cursor: 'pointer',
              fontSize: typography.fontSize.sm,
              color: colors.textDark,
            }}
          >
            <input
              type="checkbox"
              checked={formData.requires_booth}
              onChange={(e) => handleChange('requires_booth', e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            Requiere cabina/bahía
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              cursor: 'pointer',
              fontSize: typography.fontSize.sm,
              color: colors.textDark,
            }}
          >
            <input
              type="checkbox"
              checked={formData.requires_drying}
              onChange={(e) => handleChange('requires_drying', e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            Requiere secado
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              cursor: 'pointer',
              fontSize: typography.fontSize.sm,
              color: colors.textDark,
            }}
          >
            <input
              type="checkbox"
              checked={formData.can_be_parallel}
              onChange={(e) => handleChange('can_be_parallel', e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            Puede hacerse en paralelo
          </label>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'flex-end', marginTop: spacing.md }}>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.sm,
              border: `1px solid ${colors.border}`,
              borderRadius: borderRadius.lg,
              padding: `${spacing.sm} ${spacing.lg}`,
              background: colors.background,
              color: colors.textDark,
              fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.5 : 1,
            }}
          >
            <X size={16} />
            Cancelar
          </motion.button>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.sm,
              border: 'none',
              borderRadius: borderRadius.lg,
              padding: `${spacing.sm} ${spacing.lg}`,
              background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #0284c7, #06b6d4)',
              color: colors.textWhite,
              fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: shadows.md,
            }}
          >
            <Save size={16} />
            {isSubmitting ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear Servicio'}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
};
