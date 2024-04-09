import classes from './SnackBar.module.scss';
import SvgIcon from '../SvgIcon/SvgIcon';
import { useCallback, useEffect } from 'react';
import { useMotionAnimate } from 'motion-hooks';
import { useSnackBar } from '../../../contexts/snackBarContext';

const SnackBar = () => {
  const { play: openAnimation } = useMotionAnimate(
    `.${classes.snackBar}`,
    { top: '15px' },
    {
      duration: 0.5,
      easing: 'ease-in',
    }
  );

  const { play: closeAnimation } = useMotionAnimate(
    `.${classes.snackBar}`,
    { top: '-200px' },
    {
      duration: 0.5,
      easing: 'ease-in',
    }
  );

  const { content, isShowing, variant, setIsShowing } = useSnackBar();

  const handleCloseSnackBar = useCallback(() => {
    setIsShowing(false);
  }, [setIsShowing]);

  useEffect(() => {
    if (isShowing) {
      openAnimation();
    } else {
      closeAnimation();
    }
  }, [isShowing]);

  return (
    <div id="snackbar" className={classes.snackBar} data-variant={variant}>
      {content}
      <SvgIcon
        id="icon-close"
        onClick={handleCloseSnackBar}
        width={24}
        height={24}
        classNames={classes.closeIcon}
      />
    </div>
  );
};

export default SnackBar;