import { composeComponent, reduxSagaForm } from '../../utils';
import { createSelector, createStructuredSelector } from 'reselect';
import { withClasses, withStyleSheet } from '@styles/styled';

import Button from '@components/Button';
import Input from '@components/Input';
import React from 'react';
import { cancel } from '@shared/window';
import { connect } from 'react-redux';
import { createStyleSheet } from 'jss-theme-reactor';
import { onlineVersionsSelector } from '@shared/versions';
import { setDisplayName } from 'recompose';

const styleSheet = createStyleSheet('DlFactorioWindow', ({
  white
}) => ({
  window: {
    width: '25rem',
    height: '14rem',
    backgroundColor: white,
    padding: '1.25rem'
  },

  title: {
    fontWeight: '300',
    fontStyle: 'normal'
  },

  thin: {
    height: '1px'
  },

  formActions: {},

  select: {
    borderRadius: 0,
    position: 'relative'
  },

  wrapper: {
    position: 'relative',

    '&:after': {
      display: 'block',
      position: 'absolute',
      right: '.6rem',
      top: '22%',
      font: 'normal normal normal 1.2em/1 metro',
      fontSize: 'inherit',
      textRendering: 'auto',
      fontSmoothing: 'antialiased',
      verticalAlign: 'middle',
      textAlign: 'center',
      pointerEvents: 'none',
      content: '"\\e64b"'
    }
  }
}));

const Select = composeComponent(
  setDisplayName('Select'),
  withStyleSheet(styleSheet),
  withClasses('select'),
  ({ options, className, classes, ...input }) => {
    const opts = options.map(({ name, value }) => (
      <option value={value} key={value}>{name}</option>
    ));

    return (
      <div className={classes.wrapper}>
        <select {...input} className={className}>
          {opts}
        </select>
      </div>
    );
  }
);

const versionsSelector = createSelector(
  onlineVersionsSelector,
  versions => versions
    .filter(({ installed }) => !installed)
    .map(({ name }) => ({ name, value: name }))
);
const mapStateToProps = createStructuredSelector({
  versions: versionsSelector,

  initialValues: createStructuredSelector({
    version: createSelector(
      versionsSelector,
      versions => versions[0] && versions[0].name
    )
  })
});

const mapDispatchToProps = {
  cancel
};

const Window =
  composeComponent(
    setDisplayName('Window'),
    withStyleSheet(styleSheet),
    connect(mapStateToProps, mapDispatchToProps),
    reduxSagaForm({
      form: 'download'
    }),
    ({ versions, handleSubmit, classes, cancel, invalid, submitting }) => (
      <div className={classes.window}>
        <form onSubmit={handleSubmit}>
          <h1 className={classes.title}>Download Factorio</h1>
          <hr className={classes.thin} />
          <br />
          <Input name="version" label="Version:" fullSize inputComponent={Select} options={versions} />
          <br />
          <br />
          <div className={classes.formActions}>
            <Button type="submit" primary disabled={ versions.length === 0 || invalid || submitting }>Download</Button>
            <Button link onClick={cancel}>Cancel</Button>
          </div>
        </form>
      </div>
    )
  );

export default Window;
