import { PropTypes } from 'react';

const {
  number,
  shape,
  string
} = PropTypes;

/**
 * store中存储的表头数据
 */
export const fieldModelShape = shape({
  id: string.isRequired,
  datatype: number.isRequired,
  label: string.isRequired,
  type: string.isRequired
});

/**
 * store中存储的表体数据
 */
export const tableRowShape = shape({
  id: string.isRequired
});
