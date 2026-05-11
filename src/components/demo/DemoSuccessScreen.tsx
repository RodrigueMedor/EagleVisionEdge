import React from "react";
import Button from "@/components/ui/Button";
import { CheckCircle, Calendar, Mail, X } from "lucide-react";

interface DemoSuccessScreenProps {
  onClose: () => void;
}

export default function DemoSuccessScreen({ onClose }: DemoSuccessScreenProps) {
  return (
    <div className="text-center space-y-6 py-8">
      {/* Success Animation */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Success Message */}
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-primary">
          Demo Scheduled Successfully!
        </h3>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          Thank you for scheduling a demo with Eagle Vision Edge. Our team will
          contact you shortly to confirm your consultation.
        </p>
      </div>

      {/* What's Next */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 max-w-lg mx-auto">
        <h4 className="font-semibold text-primary mb-4 flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5" />
          What's Next?
        </h4>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
            <div className="text-left">
              <strong>Calendar Invite:</strong> Check your email for a calendar
              invitation with meeting details
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
            <div className="text-left">
              <strong>Confirmation:</strong> Our team will reach out within 24 hours
              to confirm your demo
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
            <div className="text-left">
              <strong>Preparation:</strong> We'll customize the demo based on your
              dealership needs
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-lg p-4 max-w-sm mx-auto">
        <p className="text-sm text-gray-600 mb-2">Questions? Contact our team:</p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <a
            href="mailto:demo@eaglevisionedge.com"
            className="text-primary hover:underline flex items-center gap-1"
          >
            <Mail className="w-4 h-4" />
            demo@eaglevisionedge.com
          </a>
        </div>
      </div>

      {/* Close Button */}
      <div className="pt-4">
        <Button onClick={onClose} className="min-w-[120px]">
          Close
        </Button>
      </div>
    </div>
  );
}
