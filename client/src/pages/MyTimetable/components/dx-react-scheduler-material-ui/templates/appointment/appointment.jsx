import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { getAppointmentColor, getResourceColor } from '../utils';

const useStyles = makeStyles(({ palette, typography, spacing }) => ({
  appointment: {
    userSelect: 'none',
    position: 'absolute',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box',
    border: `1px solid ${palette.background.paper}`,
    backgroundClip: 'padding-box',
    borderRadius: spacing(0.5),
    backgroundColor: resources => getAppointmentColor(
      300, getResourceColor(resources), palette.primary,
    ),
    ...typography.caption,
    '&:hover': {
      backgroundColor: resources => getAppointmentColor(
        400, getResourceColor(resources), palette.primary,
      ),
    },
    '&:focus': {
      backgroundColor: resources => getAppointmentColor(
        100, getResourceColor(resources), palette.primary,
      ),
      outline: 0,
    },
  },
  clickableAppointment: {
    cursor: 'pointer',
  },
  shadedAppointment: {
    backgroundColor: resources => getAppointmentColor(
      200, getResourceColor(resources), palette.primary,
    ),
    '&:hover': {
      backgroundColor: resources => getAppointmentColor(
        300, getResourceColor(resources), palette.primary,
      ),
    },
  },
}));

/**
 * A block shown in the calendar, representing a schedule.
 * @returns 
 */
export const Appointment = ({
  className,
  children,
  data,
  onClick: handleClick,
  draggable,
  isShaded,
  resources,
  forwardedRef,
  ...restProps
}) => {
  // console.log('resources: ', resources);
  const onClick = handleClick
    ? {
      onClick: ({ target }) => {
        handleClick({ target, data });
      },
    }
    : null;
  const classes = useStyles(resources);
  // console.log('classes: ', classes);
  const clickable = onClick || restProps.onDoubleClick || draggable;


  // console.log('classNames: ', classNames({
  //   [classes.appointment]: true,
  //   [classes.clickableAppointment]: clickable,
  //   [classes.shadedAppointment]: isShaded,
  // }, className));


  return (
    <div
      ref={forwardedRef}
      className={classNames({
        [classes.appointment]: true,
        [classes.clickableAppointment]: clickable,
        [classes.shadedAppointment]: isShaded,
      }, className)}
      {...onClick}
      {...restProps}
    >
      {children}
    </div>
  );
};

Appointment.propTypes = {
  children: PropTypes.node.isRequired,
  resources: PropTypes.array,
  className: PropTypes.string,
  data: PropTypes.object,
  onClick: PropTypes.func,
  draggable: PropTypes.bool,
  isShaded: PropTypes.bool,
  forwardedRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

Appointment.defaultProps = {
  resources: [],
  onClick: undefined,
  className: undefined,
  data: {},
  draggable: false,
  isShaded: false,
  forwardedRef: undefined,
};
