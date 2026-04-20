import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface ColumnFilterProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'date' | 'select' | 'number';
  options?: { value: string; label: string }[];
}

const ColumnFilter = ({ value, onChange, placeholder = 'Filter...', type = 'text', options }: ColumnFilterProps) => {
  if (type === 'select' && options) {
    return (
      <Select value={value || 'all'} onValueChange={v => onChange(v === 'all' ? '' : v)}>
        <SelectTrigger className="h-7 text-xs">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    );
  }
  return (
    <Input
      type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-7 text-xs"
    />
  );
};

export default ColumnFilter;
