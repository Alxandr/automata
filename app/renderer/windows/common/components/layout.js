import { styled } from 'styletron-react';

const getWrap = wrap => {
  switch (wrap) {
    case true:
    case 'wrap':
      return 'wrap';

    case false:
    case null:
    case undefined:
    case 'nowrap':
      return 'nowrap';

    case 'reverse':
      return 'wrap-reverse';

    default: throw new Error(`Invalid wrap value: ${wrap}.`);
  }
};

const getJustify = (justify, center) => {
  if (justify && center) {
    throw new Error('Can\'t set both justify and center');
  }

  if (center) {
    justify = 'center';
  }

  switch (justify) {
    case false:
    case undefined:
    case null:
    case 'start':
    case 'flex-start':
      return 'flex-start';

    case 'flex-end':
    case 'end':
      return 'flex-end';

    case 'center':
      return 'center';

    case true:
    case 'between':
    case 'space-between':
      return 'space-between';

    case 'around':
    case 'space-around':
      return 'space-around';

    default:
      throw new Error(`Unknown justify: ${justify}`);
  }
};

const getFlexStyle = ({ wrap, justify, center }) => ({
  'display': 'flex',
  'wrap': getWrap(wrap),
  'justify-content': getJustify(justify, center)
});

const getFlexItemStyle = ({ order, fixed, flex, width, height }) => {
  const style = {};
  if (order !== undefined) {
    if (typeof order !== 'number' && typeof order !== 'string') {
      throw new Error('Order must be a number');
    }

    style['order'] = order;
  }

  if (fixed && flex) {
    throw new Error('Can\'t set both fixed and flex');
  }

  if (fixed) {
    style['flex'] = 'none';
  }

  if (flex) {
    style['flex'] = typeof flex === 'number' || typeof flex === 'string' ? flex : 1;
  }

  if (width) {
    style['width'] = width;
  }

  if (height) {
    style['height'] = height;
  }

  return style;
};

const FlexLayout = styled('div', getFlexStyle);
const FlexItem = styled('div', getFlexItemStyle);

export const ColumnLayout = styled(FlexLayout, ({ reverse }) => ({
  'flex-direction': reverse ? 'row-reverse' : 'row'
}));

export const RowLayout = styled(FlexLayout, ({ reverse }) => ({
  'flex-direction': reverse ? 'column-reverse' : 'column'
}));

export const Column = FlexItem;
export const Row = FlexItem;
