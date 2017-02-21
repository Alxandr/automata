import { PropTypes } from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import { setDisplayName } from 'recompose';
import { withStyleSheet, withClasses, removeInvalid } from '../styles/styled';
import { composeComponent } from '../utils';

const styleSheet = createStyleSheet('Table', ({
  dark,
  grayLight,
  grayLighter,
  textColor2
}) => ({
  table: {
    width: '100%',
    margin: '.625rem 0',

    '& th, & td': {
      padding: '0.625rem'
    },

    '& thead': {
      borderBottom: `4px solid ${grayLight}`,

      '& th, & td': {
        cursor: 'default',
        color: textColor2,
        borderColor: 'transparent',
        textAlign: 'left',
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: '100%'
      }
    },

    '& tfoot': {
      borderBottom: `4px solid ${grayLight}`,

      '& th, & td': {
        cursor: 'default',
        color: textColor2,
        borderColor: 'transparent',
        textAlign: 'left',
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: '100%'
      }
    },

    '& tbody': {
      '& td': {
        padding: '0.625rem 0.85rem'
      }
    },

    '& $sortable': {
      position: 'relative',
      cursor: 'pointer',
      userSelect: 'none',

      '&:after': {
        position: 'absolute',
        content: '""',
        width: '1rem',
        height: '1rem',
        left: '100%',
        marginLeft: '-20px',
        top: '50%',
        marginTop: '-.5rem',
        color: 'inherit',
        fontSize: '1rem',
        lineHeight: '1'
      },

      '&$asc, &$dsc': {
        backgroundColor: grayLighter,

        '&:after': {
          color: dark
        }
      },

      '&$asc': {
        '&:after': {
          content: '"\\2191"'
        }
      },

      '&$dsc': {
        '&:after': {
          content: '"\\2193"'
        }
      }
    }, // end sortable

    '& tr$selected': {
      '& td': {
        backgroundColor: 'rgba(28, 183, 236, 0.10)'
      }
    },

    '& td$selected': {
      backgroundColor: 'rgba(28, 183, 236, 0.10)'
    },

    '&$border': {
      border: `1px ${grayLight} solid`
    },

    '&$bordered': {
      '& th, & td': {
        border: `1px ${grayLight} solid`
      },

      '& thead': {
        '& tr:first-child': {
          '& th, & td': {
            borderTop: 'none',

            '&:first-child': {
              borderLeft: 'none'
            },

            '&:last-child': {
              borderRight: 'none'
            }
          }
        }
      },

      '& tbody': {
        '& tr': {
          '&:first-child': {
            '& td': {
              borderTop: 'none'
            }
          },

          '& td': {
            '&:first-child': {
              borderLeft: 'none'
            },

            '&:last-child': {
              borderRight: 'none'
            }
          },

          '&:last-child': {
            '& td': {
              borderBottom: 'none'
            }
          }
        }
      }
    }
  },

  sortable: {},
  asc: {},
  dsc: {},
  selected: {},
  border: {},
  bordered: {}
}));

const Header =
  composeComponent(
    setDisplayName('Table.Header'),
    withStyleSheet(styleSheet),
    withClasses(),
    removeInvalid(),
    'thead'
  );

const Body =
  composeComponent(
    setDisplayName('Table.Body'),
    withStyleSheet(styleSheet),
    withClasses(),
    removeInvalid(),
    'tbody'
  );

const Footer =
  composeComponent(
    setDisplayName('Table.Footer'),
    withStyleSheet(styleSheet),
    withClasses(),
    removeInvalid(),
    'tfoot'
  );

const Row =
  composeComponent(
    setDisplayName('Table.Row'),
    withStyleSheet(styleSheet),
    withClasses(),
    removeInvalid(),
    'tr'
  );

const HeaderCell =
  composeComponent(
    setDisplayName('Table.HeaderCell'),
    withStyleSheet(styleSheet),
    withClasses(),
    removeInvalid(),
    'th'
  );

const Cell =
  composeComponent(
      setDisplayName('Table.Cell'),
      withStyleSheet(styleSheet),
      withClasses(),
      removeInvalid(),
      'td'
  );

const Table =
  composeComponent(
    setDisplayName('Table'),
    withStyleSheet(styleSheet),
    withClasses('table', ({ border, bordered }) => ({ border, bordered })),
    removeInvalid(),
    'table'
  );

Table.propTypes = {
  border: PropTypes.bool,
  bordered: PropTypes.bool
};

Object.assign(Table, {
  Header,
  Body,
  Footer,
  Row,
  HeaderCell,
  Cell
});

export default Table;
