/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as trainingConfirmation } from './training-confirmation.tsx'
import { template as contactConfirmation } from './contact-confirmation.tsx'
import { template as paymentReceipt } from './payment-receipt.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'training-confirmation': trainingConfirmation,
  'contact-confirmation': contactConfirmation,
  'payment-receipt': paymentReceipt,
}
