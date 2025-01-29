import { Button } from '@/components/ui/button';
import { models, TModelKey } from '@/hooks/use-llm';
import React from 'react';

type Props = {
  selectedModelKey: TModelKey;
  onModelSelect: (key: TModelKey) => void;
};

const ModalSelect = ({ selectedModelKey, onModelSelect }: Props) => {
  return (
    <div className="flex w-full items-center justify-between bg-white shadow-sm p-4 rounded-lg">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Model Selection</h2>
        <select
          value={selectedModelKey}
          onChange={(e) => onModelSelect(e.target.value as TModelKey)}
          className="border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {models.map((model) => (
            <option key={model.key} value={model.key}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      <Button variant="blue" className="gap-2">
        <span>Deploy Model</span>
      </Button>
    </div>
  );
};

export default ModalSelect;