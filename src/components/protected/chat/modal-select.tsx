import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { models, TModelKey } from '@/hooks/use-llm';
import React from 'react';
import { ModelIcon, ModelIconType } from '../model-ai/model-icon';

type Props = {
  selectedModelKey: TModelKey;
  onModelSelect: (key: TModelKey) => void;
};

const ModalSelect = ({ selectedModelKey, onModelSelect }: Props) => {
  return (
    <div className="flex w-full items-center justify-between bg-white shadow-sm p-4 py-2 rounded-lg">
      <div className="flex items-center gap-4">
        <Select
          onValueChange={(value) => onModelSelect(value as TModelKey)}
        >
          <SelectTrigger className="focus:ring- w-full rounded-md border border-gray-300 bg-gray-100 p-[6px] shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <SelectValue
            className='w-[180px]'
              placeholder="Select Model"
              defaultValue={selectedModelKey}
            />
          </SelectTrigger>
          <SelectContent className="text-[13px]">
            {models.map((model) => (
              <SelectItem
                key={model.key}
                className="border-none"
                value={model.key}
              >
                <div className="flex items-center gap-2">
                  <ModelIcon type={model.baseModel as ModelIconType} size="sm" />
                  {model.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button variant="blue" className="gap-2">
        <span>Deploy Model</span>
      </Button>
    </div>
  );
};

export default ModalSelect;