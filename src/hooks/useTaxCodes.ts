import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { TaxCode } from '@/components/admin/finance/TaxCodesTab';

export const useTaxCodes = () => {
  const [taxCodes, setTaxCodes] = useState<TaxCode[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('tax_codes' as any).select('*').eq('is_active', true).order('rate');
    if (data) setTaxCodes(data as unknown as TaxCode[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { taxCodes, loading, refetch: fetch };
};
