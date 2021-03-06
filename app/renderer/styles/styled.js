import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createEagerFactory } from 'recompose';
import { createHelper } from '../utils';
import isValidAttr from './is-valid-attr';
import warning from 'warning';
import { withStyles } from 'material-ui/styles';

export { withStyles };

const hasProperty = (() => {
  const hp = Object.prototype.hasOwnProperty;
  return (obj, name) => hp.call(obj, [name]);
})();

const get = classes => name => {
  warning(
    hasProperty(classes, name),
    `Class name ${name} not found in classes list.`,
  );
  return classes[name];
};

export const withClasses = createHelper(
  (...compNames) => BaseComponent => {
    const factory = createEagerFactory(BaseComponent);
    const WithClasses = ({ classes, className, ...props }) => {
      if (!classes) {
        return null;
      }

      const names = compNames.reduce(
        (all, names) => {
          if (typeof names === 'function') {
            names = names(props);
          }

          if (typeof names === 'string') {
            names = [get(classes)(names)];
          } else if (Array.isArray(names)) {
            names = names.map(get(classes));
          } else {
            names = Object.keys(names).filter(n => names[n]).map(get(classes));
          }

          return all.concat(names);
        },
        [className],
      );

      return factory({ ...props, classes, className: classNames(names) });
    };

    WithClasses.propTypes = {
      classes: PropTypes.object.isRequired,
      className: PropTypes.string,
    };
    return WithClasses;
  },
  'withClasses',
);

export const removeInvalid = createHelper(
  () => BaseComponent => {
    const factory = createEagerFactory(BaseComponent);
    return props => {
      const newProps = Object.keys(props)
        .filter(isValidAttr)
        .reduce((o, n) => ({ ...o, [n]: props[n] }), {});

      return factory(newProps);
    };
  },
  'removeInvalid',
);
