/* eslint-disable react/prop-types */
import * as importedActions from 'redux-form/lib/actions';

import { Component, PropTypes } from 'react';
import { createEagerFactory, wrapDisplayName } from 'recompose';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import createHelper from './createHelper';
import createIsValid from 'redux-form/lib/selectors/isValid';
import { createSelector } from 'reselect';
import defaultShouldValidate from 'redux-form/lib/defaultShouldValidate';
import { formStateSelector } from '@shared/window';
import generateValidator from 'redux-form/lib/generateValidator';
import mapValues from 'lodash.mapvalues';
import merge from 'lodash.merge';
import structure from 'redux-form/lib/structure/plain';

const { deepEqual, empty, getIn, keys, fromJS } = structure;
const isValid = createIsValid(structure);

const {
  arrayInsert,
  arrayMove,
  arrayPop,
  arrayPush,
  arrayRemove,
  arrayRemoveAll,
  arrayShift,
  arraySplice,
  arraySwap,
  arrayUnshift,
  blur,
  change,
  focus,
  ...formActions
} = importedActions;

const arrayActions = {
  arrayInsert,
  arrayMove,
  arrayPop,
  arrayPush,
  arrayRemove,
  arrayRemoveAll,
  arrayShift,
  arraySplice,
  arraySwap,
  arrayUnshift
};

const defaultConfig = {
  touchOnBlur: true,
  touchOnChange: false,
  persistentSubmitErrors: false,
  destroyOnUnmount: true,
  enableReinitialize: false,
  keepDirtyOnReinitialize: false,
  getFormState: formStateSelector,
  pure: true,
  forceUnregisterOnUnmount: false,
  shouldValidate: defaultShouldValidate
};

const reduxSagaForm = createHelper(initialConfig => BaseComponent => {
  const factory = createEagerFactory(BaseComponent);
  const config = {
    ...defaultConfig,
    ...initialConfig
  };

  if (!config.form) {
    throw new Error('No form name provided');
  }

  class Form extends Component {
    constructor(props, context) {
      super(props, context);
      this.submit = this.submit.bind(this);
      this.getValues = this.getValues.bind(this);
      this.register = this.register.bind(this);
      this.unregister = this.unregister.bind(this);
      this.fieldValidators = {};
      this.lastFieldValidatorKeys = [];
      this.fieldWarners = {};
      this.lastFieldWarnerKeys = [];
    }

    getChildContext() {
      return {
        _reduxForm: {
          ...this.props,
          getFormState: createSelector(config.getFormState, state => state[config.form]),
          getValues: this.getValues,
          sectionPrefix: undefined,
          register: this.register,
          unregister: this.unregister
        }
      };
    }

    initIfNeeded(nextProps) {
      const { enableReinitialize } = this.props;
      if (nextProps) {
        if ((enableReinitialize || !nextProps.initialized) && !deepEqual(this.props.initialValues, nextProps.initialValues)) {
          const keepDirty = nextProps.initialized && this.props.keepDirtyOnReinitialize;
          this.props.initialize(nextProps.initialValues, keepDirty);
        }
      } else if (this.props.initialValues && (!this.props.initialized || enableReinitialize)) {
        this.props.initialize(this.props.initialValues, this.props.keepDirtyOnReinitialize);
      }
    }

    updateSyncErrorsIfNeeded(nextSyncErrors, nextError) {
      const { error, syncErrors, updateSyncErrors } = this.props;
      const noErrors = (!syncErrors || !Object.keys(syncErrors).length) && !error;
      const nextNoErrors = (!nextSyncErrors || !Object.keys(nextSyncErrors).length) && !nextError;
      if (!(noErrors && nextNoErrors) && (!deepEqual(syncErrors, nextSyncErrors) || !deepEqual(error, nextError))) {
        updateSyncErrors(nextSyncErrors, nextError);
      }
    }

    validateIfNeeded(nextProps) {
      const { shouldValidate, validate, values } = this.props;
      const fieldLevelValidate = this.generateValidator();
      if (validate || fieldLevelValidate) {
        const initialRender = nextProps === undefined;
        const fieldValidatorKeys = Object.keys(this.getValidators());
        const shouldValidateResult = shouldValidate({
          values,
          nextProps,
          props: this.props,
          initialRender,
          lastFieldValidatorKeys: this.lastFieldValidatorKeys,
          fieldValidatorKeys,
          structure
        });

        if (shouldValidateResult) {
          const propsToValidate = initialRender ? this.props : nextProps;
          const { _error, ...nextSyncErrors } = merge(
            validate ? validate(propsToValidate.values, propsToValidate) || {} : {},
            fieldLevelValidate ?
            fieldLevelValidate(propsToValidate.values, propsToValidate) || {} : {}
          );
          this.lastFieldValidatorKeys = fieldValidatorKeys;
          this.updateSyncErrorsIfNeeded(nextSyncErrors, _error);
        }
      }
    }

    updateSyncWarningsIfNeeded(nextSyncWarnings, nextWarning) {
      const { warning, syncWarnings, updateSyncWarnings } = this.props;
      const noWarnings = (!syncWarnings || !Object.keys(syncWarnings).length) && !warning;
      const nextNoWarnings = (!nextSyncWarnings || !Object.keys(nextSyncWarnings).length) && !nextWarning;
      if (!(noWarnings && nextNoWarnings) && (!deepEqual(syncWarnings, nextSyncWarnings) || !deepEqual(warning, nextWarning))) {
        updateSyncWarnings(nextSyncWarnings, nextWarning);
      }
    }

    warnIfNeeded(nextProps) {
      const { shouldValidate, warn, values } = this.props;
      const fieldLevelWarn = this.generateWarner();
      if (warn || fieldLevelWarn) {
        const initialRender = nextProps === undefined;
        const fieldWarnerKeys = Object.keys(this.getWarners());
        const shouldWarnResult = shouldValidate({
          values,
          nextProps,
          props: this.props,
          initialRender,
          lastFieldValidatorKeys: this.lastFieldWarnerKeys,
          fieldValidatorKeys: fieldWarnerKeys,
          structure
        });

        if (shouldWarnResult) {
          const propsToWarn = initialRender ? this.props : nextProps;
          const { _warning, ...nextSyncWarnings } = merge(
            warn ? warn(propsToWarn.values, propsToWarn) : {},
            fieldLevelWarn ?
              fieldLevelWarn(propsToWarn.values, propsToWarn) : {}
          );

          this.lastFieldWarnerKeys = fieldWarnerKeys;
          this.updateSyncWarningsIfNeeded(nextSyncWarnings, _warning);
        }
      }
    }

    componentWillMount() {
      this.initIfNeeded();
      this.validateIfNeeded();
      this.warnIfNeeded();
    }

    componentWillReceiveProps(nextProps) {
      this.initIfNeeded(nextProps);
      this.validateIfNeeded(nextProps);
      this.warnIfNeeded(nextProps);
      if (nextProps.onChange) {
        if (!deepEqual(nextProps.values, this.props.values)) {
          nextProps.onChange(nextProps.values);
        }
      }
    }

    componentWillUnmount() {
      const { destroyOnUnmount, destroy } = this.props;
      if (destroyOnUnmount) {
        this.destroyed = true;
        destroy();
      }
    }

    getValues() {
      return this.props.values;
    }

    isValid() {
      return this.props.valid;
    }

    isPristine() {
      return this.props.pristine;
    }

    register(name, type, getValidator, getWarner) {
      this.props.registerField(name, type);
      if (getValidator) {
        this.fieldValidators[name] = getValidator;
      }
      if (getWarner) {
        this.fieldWarners[name] = getWarner;
      }
    }

    unregister(name) {
      if (!this.destroyed) {
        if (this.props.destroyOnUnmount || this.props.forceUnregisterOnUnmount) {
          this.props.unregisterField(name);
          delete this.fieldValidators[name];
          delete this.fieldWarners[name];
        } else {
          this.props.unregisterField(name, false);
        }
      }
    }

    submit(evt) {
      evt.preventDefault();
      this._handleSubmit(this.props, this.props.validExceptSubmit, this.asyncValidate, this.getFieldList({ excludeFieldArray: true }));
    }

    _handleSubmit(props, valid, asyncValidate, fields) {
      const { dispatch, startSubmit, touch, persistentSubmitErrors } = props;

      touch(...fields);
      if (valid || persistentSubmitErrors) {
        startSubmit();
        dispatch({
          type: '@form/SUBMIT',
          payload: this.getValues(),
          meta: {
            form: this.props.form
          }
        });
      }
    }

    getFieldList(options) {
      const registeredFields = this.props.registeredFields;
      const list = [];
      if (!registeredFields) {
        return list;
      }

      let keySeq = keys(registeredFields);
      if (options && options.excludeFieldArray) {
        keySeq = keySeq.filter(name => getIn(registeredFields, `['${name}'].type`) !== 'FieldArray');
      }

      return fromJS(keySeq.reduce((acc, key) => {
        acc.push(key);
        return acc;
      }, list));
    }

    getValidators() {
      const validators = {};
      Object.keys(this.fieldValidators).forEach(name => {
        const validator = this.fieldValidators[name]();
        if (validator) {
          validators[name] = validator;
        }
      });
      return validators;
    }

    generateValidator() {
      const validators = this.getValidators();
      return Object.keys(validators).length ? generateValidator(validators, structure) : undefined;
    }

    getWarners() {
      const warners = {};
      Object.keys(this.fieldWarners).forEach(name => {
        const warner = this.fieldWarners[name]();
        if (warner) {
          warners[name] = warner;
        }
      });
      return warners;
    }

    generateWarner() {
      const warners = this.getWarners();
      return Object.keys(warners).length ? generateValidator(warners, structure) : undefined;
    }

    render() {
      // remove some redux-form config-only props
      /* eslint-disable no-unused-vars */
      const {
        anyTouched,
        arrayInsert,
        arrayMove,
        arrayPop,
        arrayPush,
        arrayRemove,
        arrayRemoveAll,
        arrayShift,
        arraySplice,
        arraySwap,
        arrayUnshift,
        asyncErrors,
        asyncValidate,
        asyncValidating,
        blur,
        change,
        destroy,
        destroyOnUnmount,
        forceUnregisterOnUnmount,
        dirty,
        dispatch,
        enableReinitialize,
        error,
        focus,
        form,
        getFormState,
        initialize,
        initialized,
        initialValues,
        invalid,
        keepDirtyOnReinitialize,
        pristine,
        propNamespace,
        registeredFields,
        registerField,
        reset,
        setSubmitFailed,
        setSubmitSucceeded,
        shouldAsyncValidate,
        shouldValidate,
        startAsyncValidation,
        startSubmit,
        stopAsyncValidation,
        stopSubmit,
        submitting,
        submitFailed,
        submitSucceeded,
        touch,
        touchOnBlur,
        touchOnChange,
        persistentSubmitErrors,
        syncErrors,
        syncWarnings,
        unregisterField,
        untouch,
        updateSyncErrors,
        updateSyncWarnings,
        valid,
        validExceptSubmit,
        values,
        warning,
        ...rest
      } = this.props;
      /* eslint-enable no-unused-vars */

      const reduxFormProps = {
        anyTouched,
        asyncValidate: this.asyncValidate,
        asyncValidating,
        ...bindActionCreators({ blur, change }, dispatch),
        destroy,
        dirty,
        dispatch,
        error,
        form,
        handleSubmit: this.submit,
        initialize,
        initialized,
        initialValues,
        invalid,
        pristine,
        reset,
        submitting,
        submitFailed,
        submitSucceeded,
        touch,
        untouch,
        valid,
        warning
      };

      const propsToPass = {
        ...(propNamespace ? { [propNamespace]: reduxFormProps } : reduxFormProps),
        ...rest
      };

      return factory(propsToPass);
    }
  }

  Form.displayName = wrapDisplayName(BaseComponent, 'sagaForm');
  Form.childContextTypes = {
    _reduxForm: PropTypes.object.isRequired
  };
  Form.propTypes = {
    destroyOnUnmount: PropTypes.bool,
    forceUnregisterOnUnmount: PropTypes.bool,
    form: PropTypes.string.isRequired,
    initialValues: PropTypes.object,
    getFormState: PropTypes.func,
    onSubmitFail: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
    propNameSpace: PropTypes.string,
    validate: PropTypes.func,
    warn: PropTypes.func,
    touchOnBlur: PropTypes.bool,
    touchOnChange: PropTypes.bool,
    triggerSubmit: PropTypes.bool,
    persistentSubmitErrors: PropTypes.bool,
    registeredFields: PropTypes.any
  };

  const mapStateToProps = (state, props) => {
    const { form, getFormState, initialValues, enableReinitialize, keepDirtyOnReinitialize } = props;
    const formState = getIn(getFormState(state) || empty, form) || empty;
    const stateInitial = getIn(formState, 'initial');
    const initialized = !!stateInitial;

    const shouldUpdateInitialValues = enableReinitialize && initialized && !deepEqual(initialValues, stateInitial);
    const shouldResetValues = shouldUpdateInitialValues && !keepDirtyOnReinitialize;

    let initial = initialValues || stateInitial || empty;

    if (shouldUpdateInitialValues) {
      initial = stateInitial || empty;
    }

    let values = getIn(formState, 'values') || initial;

    if (shouldResetValues) {
      values = initial;
    }

    const pristine = shouldResetValues || deepEqual(initial, values);
    const asyncErrors = getIn(formState, 'asyncErrors');
    const syncErrors = getIn(formState, 'syncErrors') || {};
    const syncWarnings = getIn(formState, 'syncWarnings') || {};
    const registeredFields = getIn(formState, 'registeredFields');
    const valid = isValid(form, getFormState, false)(state);
    const validExceptSubmit = isValid(form, getFormState, true)(state);
    const anyTouched = !!getIn(formState, 'anyTouched');
    const submitting = !!getIn(formState, 'submitting');
    const submitFailed = !!getIn(formState, 'submitFailed');
    const submitSucceeded = !!getIn(formState, 'submitSucceeded');
    const error = getIn(formState, 'error');
    const warning = getIn(formState, 'warning');
    const triggerSubmit = getIn(formState, 'triggerSubmit');

    return {
      anyTouched,
      asyncErrors,
      asyncValidating: getIn(formState, 'asyncValidating') || false,
      dirty: !pristine,
      error,
      initialized,
      invalid: !valid,
      pristine,
      registeredFields,
      submitting,
      submitFailed,
      submitSucceeded,
      syncErrors,
      syncWarnings,
      triggerSubmit,
      values,
      valid,
      validExceptSubmit,
      warning
    };
  };

  const mapDispatchToProps = (dispatch, initialProps) => {
    const bindForm = actionCreator => actionCreator.bind(null, initialProps.form);

    // Bind the first parameter on `props.form`
    const boundFormACs = mapValues(formActions, bindForm);
    const boundArrayACs = mapValues(arrayActions, bindForm);
    const boundBlur = (field, value) => blur(initialProps.form, field, value, !!initialProps.touchOnBlur);
    const boundChange = (field, value) => change(initialProps.form, field, value, !!initialProps.touchOnChange, !!initialProps.persistentSubmitErrors);
    const boundFocus = bindForm(focus);

    // Wrap action creators with `dispatch`
    const connectedFormACs = bindActionCreators(boundFormACs, dispatch);

    const connectedArrayACs = {
      insert: bindActionCreators(boundArrayACs.arrayInsert, dispatch),
      move: bindActionCreators(boundArrayACs.arrayMove, dispatch),
      pop: bindActionCreators(boundArrayACs.arrayPop, dispatch),
      push: bindActionCreators(boundArrayACs.arrayPush, dispatch),
      remove: bindActionCreators(boundArrayACs.arrayRemove, dispatch),
      removeAll: bindActionCreators(boundArrayACs.arrayRemoveAll, dispatch),
      shift: bindActionCreators(boundArrayACs.arrayShift, dispatch),
      splice: bindActionCreators(boundArrayACs.arraySplice, dispatch),
      swap: bindActionCreators(boundArrayACs.arraySwap, dispatch),
      unshift: bindActionCreators(boundArrayACs.arrayUnshift, dispatch)
    };

    const computedActions = {
      ...connectedFormACs,
      ...boundArrayACs,
      blur: boundBlur,
      change: boundChange,
      array: connectedArrayACs,
      focus: boundFocus,
      dispatch
    };

    return computedActions;
  };

  const ConnectedForm = connect(mapStateToProps, mapDispatchToProps)(Form);
  ConnectedForm.defaultProps = config;
  const connectedFormFactory = createEagerFactory(ConnectedForm);

  return class SagaForm extends Component {
    render() {
      const { initialValues, ...rest } = this.props;
      return connectedFormFactory({
        ...rest,
        initialValues: fromJS(initialValues)
      });
    }
  };
}, 'reduxSagaForm');

export default reduxSagaForm;
