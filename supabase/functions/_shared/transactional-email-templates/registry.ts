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
import { template as invoiceEmail } from './invoice-email.tsx'
import { template as accountDeletionRequest } from './account-deletion-request.tsx'
import { template as accountCredentials } from './account-credentials.tsx'
import { template as mindcheckResults } from './mindcheck-results.tsx'
import { template as b2bEmployeeConfirmation } from './b2b-employee-confirmation.tsx'
import { template as b2bEmployeeResults } from './b2b-employee-results.tsx'
import { template as b2bCompanyConfirmation } from './b2b-company-confirmation.tsx'
import { template as b2bCompanyReport } from './b2b-company-report.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'training-confirmation': trainingConfirmation,
  'contact-confirmation': contactConfirmation,
  'payment-receipt': paymentReceipt,
  'invoice-email': invoiceEmail,
  'account-deletion-request': accountDeletionRequest,
  'account-credentials': accountCredentials,
  'mindcheck-results': mindcheckResults,
  'b2b-employee-confirmation': b2bEmployeeConfirmation,
  'b2b-employee-results': b2bEmployeeResults,
  'b2b-company-confirmation': b2bCompanyConfirmation,
  'b2b-company-report': b2bCompanyReport,
}
