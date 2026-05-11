import Modal from '@/components/ui/Modal'
import FinancingForm from '@/components/financing/FinancingForm'
import { ModalProps } from '@/types/financing'

interface FinancingModalProps extends Omit<ModalProps, 'title' | 'children'> {
  onSuccess?: () => void
}

export default function FinancingModal({ isOpen, onClose, onSuccess, ...props }: FinancingModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Financing"
      size="lg"
      {...props}
    >
      <FinancingForm onSuccess={onSuccess} onCancel={onClose} />
    </Modal>
  )
}
