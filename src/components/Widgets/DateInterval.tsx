import React, { useContext, useState } from 'react';
import { clone } from '../../utils/clone';
import { isString, isStringArray, isUndefined } from '../../utils/types';
import { BuilderContext } from '../Context';

const values = [
  { value: 'hours', label: 'hour(s) ago' },
  { value: 'days', label: 'day(s) ago' },
  { value: 'months', label: 'month(s) ago' },
  { value: 'years', label: 'year(s) ago' },
];

export interface DateIntervalProps {
  value: string | string[];
  id: string;
}

export const DateInterval: React.FC<DateIntervalProps> = ({ value, id }) => {
  const { data, setData, onChange, components, strings, readOnly } = useContext(
    BuilderContext
  );
  let intervalNumber;
  let intervalString;
  if (isString(value)) {
    intervalNumber = value ? [value.split(' ')[0]] : ['1'];
    intervalString = value ? [value.split(' ')[1]] : [''];
  } else if (isStringArray(value)) {
    intervalNumber = value ? value.map(v => v.split(' ')[0]) : ['1', '1'];
    intervalString = value ? value.map(v => v.split(' ')[1]) : ['', ''];
  } else {
    intervalNumber = ['1'];
    intervalString = [''];
  }
  const [dateIntervalNumber, setDateIntervalNumber] = useState(intervalNumber);
  const [dateIntervalString, setDateIntervalString] = useState(intervalString);
  const { form } = components;

  const handleChange = (type: string, val: string, index?: number) => {
    let retVal;
    const tmpIntervalNumber = [...dateIntervalNumber];
    const tmpIntervalString = [...dateIntervalString];
    const clonedData = clone(data);
    const parentIndex = clonedData.findIndex((item: any) => item.id === id);

    if (type === 'number') {
      tmpIntervalNumber[index || 0] = val;
      setDateIntervalNumber(tmpIntervalNumber);
      retVal = `${val} ${
        dateIntervalString[index || 0] ? dateIntervalString[index || 0] : ''
      }`;
    } else {
      tmpIntervalString[index || 0] = val;
      setDateIntervalString(tmpIntervalString);
      retVal = `${
        dateIntervalNumber[index || 0] ? dateIntervalNumber[index || 0] : ''
      } ${val}`;
    }

    if (!isUndefined(index)) {
      clonedData[parentIndex].value[index || 0] = retVal;
    } else {
      clonedData[parentIndex].value = retVal;
    }

    setData(clonedData);
    onChange(clonedData);
  };

  if (form && strings.form && !readOnly) {
    if (isStringArray(value)) {
      return (
        <>
          <div style={{ width: '100%' }}>
            <form.Input
              type="number"
              value={dateIntervalNumber[0]}
              onChange={(v: string) => handleChange('number', v, 0)}
              disabled={readOnly}
            />
            <form.Select
              onChange={(v: string) => handleChange('interval', v, 0)}
              selectedValue={dateIntervalString[0]}
              emptyValue={strings.form.selectYourValue}
              values={values}
              disabled={readOnly}
            />
          </div>
          <div style={{ width: '100%' }}>
            <form.Input
              type="number"
              value={dateIntervalNumber[1]}
              onChange={(v: string) => handleChange('number', v, 1)}
              disabled={readOnly}
            />
            <form.Select
              onChange={(v: string) => handleChange('interval', v, 1)}
              selectedValue={dateIntervalString[1]}
              emptyValue={strings.form.selectYourValue}
              values={values}
              disabled={readOnly}
            />
          </div>
        </>
      );
    } else {
      return (
        <>
          <form.Input
            type="number"
            value={dateIntervalNumber[0]}
            onChange={(v: string) => handleChange('number', v)}
            disabled={readOnly}
          />
          <form.Select
            onChange={(v: string) => handleChange('interval', v)}
            selectedValue={dateIntervalString[0]}
            emptyValue={strings.form.selectYourValue}
            values={values}
            disabled={readOnly}
          />
        </>
      );
    }
  }

  return null;
};
