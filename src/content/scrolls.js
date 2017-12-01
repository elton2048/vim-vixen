const SCROLL_DELTA_X = 48;
const SCROLL_DELTA_Y = 48;

const isVisible = (win, element) => {
  let rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return false;
  }
  if (rect.right < 0 && rect.bottom < 0) {
    return false;
  }
  if (win.innerWidth < rect.left && win.innerHeight < rect.top) {
    return false;
  }

  let { display, visibility } = win.getComputedStyle(element);
  if (display === 'none' || visibility === 'hidden') {
    return false;
  }
  return true;
};

const isScrollableStyle = (win, element) => {
  let { overflowX, overflowY } = win.getComputedStyle(element);
  return !(overflowX !== 'scroll' && overflowX !== 'auto' &&
    overflowY !== 'scroll' && overflowY !== 'auto');
};

const isOverflowed = (element) => {
  return element.scrollWidth > element.clientWidth ||
    element.scrollHeight > element.clientHeight;
};

// Find a visiable and scrollable element by depth-first search.  Currently
// this method is called by each scrolling, and the returned value of this
// method is not cached.  That does not cause performance issue because in the
// most pages, the window is root element i,e, documentElement.
const findScrollable = (win, element) => {
  if (isScrollableStyle(win, element) && isOverflowed(element)) {
    return element;
  }

  let children = Array.prototype
    .filter.call(element.children, e => isVisible(win, e));
  for (let child of children) {
    let scrollable = findScrollable(win, child);
    if (scrollable) {
      return scrollable;
    }
  }
  return null;
};

/**
 * Function for smooth scrolling feature.
 * Using the JavaScript window.requestAnimationFrame function to have the smooth
 * scrolling effect in the window.
 * @param  {[number]} x x position target of the documentElement
 * @param  {[number]} y y position target of the documentElement
 * @param  {[number]} step step for each smooth scrolling. Larger will be faster.
 */
const smoothScroll = (x, y, step = 5) => {
    const scrollAnimation = (timestamp) => {
        let targetX = document.documentElement.scrollLeft;
        let targetY = document.documentElement.scrollTop;

        if (x < 0) x = 0;
        if (x > document.documentElement.scrollLeftMax) x = document.documentElement.scrollLeftMax;

        if (y < 0) y = 0;
        if (y > document.documentElement.scrollTopMax) y = document.documentElement.scrollTopMax;
        if (Math.abs(targetY - y) > step) {
            if (targetY < y) {
                document.documentElement.scrollTop = targetY + step;
                window.requestAnimationFrame(scrollAnimation);
            } else {
                document.documentElement.scrollTop = targetY - step;
                window.requestAnimationFrame(scrollAnimation);
            }
        }

        if (Math.abs(targetX - x) > step) {
            if (targetX < x) {
                document.documentElement.scrollLeft = targetX + step;
                window.requestAnimationFrame(scrollAnimation);
            } else {
                document.documentElement.scrollLeft = targetX - step;
                window.requestAnimationFrame(scrollAnimation);
            }
        }
    }
    window.requestAnimationFrame(scrollAnimation);
}

const scrollTarget = (win) => {
  if (isOverflowed(win.document.documentElement)) {
    return win.document.documentElement;
  }
  if (isOverflowed(win.document.body)) {
    return win.document.body;
  }
  let target = findScrollable(win, win.document.documentElement);
  if (target) {
    return target;
  }
  return win.document.documentElement;
};

const scrollVertically = (win, count) => {
  let target = scrollTarget(win);
  let x = target.scrollLeft;
  let y = target.scrollTop + SCROLL_DELTA_Y * count;
  target.scrollTo(x, y);
  // smoothScroll(x, y);
};

const scrollHorizonally = (win, count) => {
  let target = scrollTarget(win);
  let x = target.scrollLeft + SCROLL_DELTA_X * count;
  let y = target.scrollTop;
  target.scrollTo(x, y);
  // smoothScroll(x, y);
};

const scrollPages = (win, count) => {
  let target = scrollTarget(win);
  let height = target.clientHeight;
  let x = target.scrollLeft;
  let y = target.scrollTop + height * count;
  target.scrollTo(x, y);
  // smoothScroll(x, y, 25);
};

const scrollTop = (win) => {
  let target = scrollTarget(win);
  let x = target.scrollLeft;
  let y = 0;
  target.scrollTo(x, y);
  // smoothScroll(x, y, 50);
};

const scrollBottom = (win) => {
  let target = scrollTarget(win);
  let x = target.scrollLeft;
  let y = target.scrollHeight;
  target.scrollTo(x, y);
  // smoothScroll(x, y, 50);
};

const scrollHome = (win) => {
  let target = scrollTarget(win);
  let x = 0;
  let y = target.scrollTop;
  target.scrollTo(x, y);
  // smoothScroll(x, y, 50);
};

const scrollEnd = (win) => {
  let target = scrollTarget(win);
  let x = target.scrollWidth;
  let y = target.scrollTop;
  target.scrollTo(x, y);
  // smoothScroll(x, y, 50);
};

export {
  scrollVertically, scrollHorizonally, scrollPages,
  scrollTop, scrollBottom, scrollHome, scrollEnd
};
