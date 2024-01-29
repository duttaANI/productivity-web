import React from 'react';
import { DropdownOption, NumORStr } from '@/types';
import SelectDropdown from '../common/SelectDropdown';

export enum FORM_FIELD {
  DROPDOWN = "DROPDOWN",
  INPUT = "INPUT",
  TEXTAREA = "TEXTAREA",
  POWERED_TEXTAREA = "POWERED_TEXTAREA", // markdown
  CHECKBOX = "CHECKBOX",
}

type ComponentProps = {
  key: string,
  placeholder?: string,
  type?: string,
  required?: boolean,
}

type AdditionalPropsMap = {
  [FORM_FIELD.DROPDOWN]: {
    defaultOption: DropdownOption,
    optionList: DropdownOption[],
  };
  [FORM_FIELD.INPUT]: {
    // maxLength: number;
  };
  [FORM_FIELD.TEXTAREA]: {
    // rows: number;
  };
  [FORM_FIELD.POWERED_TEXTAREA]: {
    // markdownOptions: any;
  };
  [FORM_FIELD.CHECKBOX]: {
    // label: string;
  };
};

type FormField<T extends FORM_FIELD> = {
  kind: T,
  componentProps: ComponentProps,
  additionalProps?: AdditionalPropsMap[T],
};

type FormStructureType<T> = {
  onSubmit: (entity: T) => Promise<void>,
  fields: FormField<FORM_FIELD>[],
  defaultInput: { [key: string]: NumORStr }
  submitLabel: string,
}

// can probably replace any with all possible options of the form
const CustomForm: React.FC<{ formStructure: FormStructureType<any> }> = ({ formStructure }) => {

  const handleEntityFieldChange = (key: string, newValue: NumORStr) => {
    setEntity({ ...entity, [key]: newValue });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await formStructure.onSubmit(entity);
    setEntity((entity) => ({ ...entity, ...formStructure.defaultInput }));
  }

  const [entity, setEntity] = React.useState(formStructure.defaultInput);

  return (
    <form onSubmit={handleSubmit}>
      {formStructure.fields.map((field) => {
        if (field.kind === FORM_FIELD.INPUT) {
          return (
            <input
              key={field.componentProps.key}
              placeholder={field.componentProps.placeholder || "Enter"}
              type={field.componentProps.type || "text"}
              required={field.componentProps.required || false}
              onChange={(e) => handleEntityFieldChange(field.componentProps.key, e.target.value)}
              value={entity[field.componentProps.key]}
            />
          )
        } else if (field.kind === FORM_FIELD.DROPDOWN) {
          return (
            <SelectDropdown
              key={field.componentProps.key}
              handleValueChange={(newVal) => handleEntityFieldChange(field.componentProps.key, newVal)}
              {...field.additionalProps as AdditionalPropsMap[FORM_FIELD.DROPDOWN]}
            />
          )
        }
        return null;
      })}
      <button
        type="submit"
        className="btn btn-primary"
      >
        {formStructure.submitLabel}
      </button>
    </form>
  );
};



export default CustomForm;