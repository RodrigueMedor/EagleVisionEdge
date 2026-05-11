import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { CheckCircle, Car } from 'lucide-react'
import { ModalProps } from '@/types/financing'

interface SuccessModalProps extends Omit<ModalProps, 'title' | 'children'> {
  applicationId?: string
  onNewApplication?: () => void
}

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  applicationId, 
  onNewApplication,
  ...props 
}: SuccessModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Application Submitted Successfully!"
      size="md"
      {...props}
    >
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Car className="w-6 h-6 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-primary mb-4">
          Thank You for Your Application!
        </h3>
        
        <p className="text-gray-600 mb-6">
          Your financing application has been received and is now being reviewed by our team.
        </p>
        
        {applicationId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Application ID</p>
            <p className="font-mono font-semibold text-primary">{applicationId}</p>
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>What happens next?</strong><br />
            Our team will review your application and contact you within 24 hours with your approval status and next steps.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Got it, Thanks!
          </Button>
          
          {onNewApplication && (
            <Button
              variant="secondary"
              onClick={onNewApplication}
              className="w-full sm:w-auto"
            >
              Submit Another Application
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
