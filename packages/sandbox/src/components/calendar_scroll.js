import useOffsets from '@jwdinker/use-offsets';

import React, { Children, useMemo, useRef, useState, useEffect } from 'react';
import useScroll from '@jwdinker/use-scroll';

import useWindowSize from '@jwdinker/use-window-size';

const CONTAINER_CONTENTS = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  maxHeight: '100vh',
  boxSizing: 'border-box',
};

const SCROLLER_STYLE = {
  position: 'absolute',

  width: '100%',
  WebkitOverflowScrolling: 'touch',
  maxWidth: '100%',
  overflow: 'scroll',
  boxSizing: 'border-box',
  willChange: 'scroll-position',
};

const Spacer = ({ space, multipier }) => {
  const style = useMemo(() => {
    return {
      minHeight: `${space * multipier}px`,
    };
  }, [multipier, space]);
  return <div style={style} />;
};

const EmptyDiv = () => {
  return <div />;
};

const CalendarScroller = ({ children, incrementer, decrementer, maxWidth = '100%' } = {}) => {
  const count = Children.count(children);
  const scroller = useRef();
  const element = useRef();
  const set = useRef(false);
  const [multipiers, setMultipiers] = useState([300, 300]);
  const previousScroll = useRef(0);

  const [sizes, changed] = useWindowSize();

  const [offsets, remeasure] = useOffsets(element);

  const index = useRef(0);

  const [scroll] = useScroll(scroller);
  console.log('SCROLL: ', scroll.top, offsets.height);
  useEffect(() => {
    if (changed) {
      remeasure();
    }
  }, [changed, remeasure]);

  useEffect(() => {
    if (scroll.direction === 'up' && scroll.top <= offsets.height * multipiers[0]) {
      setMultipiers(([before, after]) => {
        return [before - 1, after + 1];
      });
      decrementer();
    }

    if (scroll.direction === 'down' && scroll.top >= offsets.height * (multipiers[0] + 2)) {
      setMultipiers(([before, after]) => {
        return [before + 1, after - 1];
      });
      incrementer();
    }
  }, [
    decrementer,
    incrementer,
    multipiers,
    offsets.height,
    offsets.width,
    scroll.direction,
    scroll.left,
    scroll.top,
  ]);

  const childStyle = useMemo(() => {
    return {
      flexShrink: 0,
      width: `100%`,
    };
  }, []);

  useEffect(() => {
    if (!set.current && offsets.height !== 0) {
      scroller.current.scrollTop = offsets.height * multipiers[0];

      set.current = true;
    }
  }, [changed, multipiers, offsets.height, offsets.width]);

  return useMemo(() => {
    return (
      <div ref={scroller} style={SCROLLER_STYLE}>
        <div style={CONTAINER_CONTENTS}>
          <Spacer space={offsets.height} multipier={multipiers[0]} />
          {Children.map(children, (child) => {
            return (
              <div ref={element} key={child.key} style={childStyle}>
                {child}
              </div>
            );
          })}
          {/* <div ref={element} style={childStyle}>
            <div id="COME ON" style={{ width: `100%`, paddingTop: `96.284%` }} />
          </div> */}
          <Spacer space={offsets.height} multipier={multipiers[1]} />
        </div>
      </div>
    );
  }, [childStyle, children, multipiers, offsets.height]);
};

export default CalendarScroller;

// import useOffsets from '@jwdinker/use-offsets';

// import React, { Children, useMemo, useRef, useState, useEffect } from 'react';
// import useScroll from '@jwdinker/use-scroll';

// import useWindowSize from '@jwdinker/use-window-size';

// const CONTAINER_CONTENTS = {
//   display: 'flex',
//   width: '100%',
//   height: '100%',
//   boxSizing: 'border-box',
// };

// const SCROLLER_STYLE = {
//   position: 'absolute',

//   width: '100%',
//   WebkitOverflowScrolling: 'touch',
//   maxWidth: '100%',
//   overflow: 'scroll',
//   boxSizing: 'border-box',
//   willChange: 'scroll-position',
// };

// const Spacer = ({ space, multipier }) => {
//   const style = useMemo(() => {
//     return {
//       minWidth: `${space * multipier}px`,
//     };
//   }, [multipier, space]);
//   return <div style={style} />;
// };

// const EmptyDiv = () => {
//   return <div />;
// };

// const CalendarScroller = ({ children, incrementer, decrementer, maxWidth = '100%' } = {}) => {
//   const count = Children.count(children);
//   const scroller = useRef();
//   const element = useRef();
//   const set = useRef(false);
//   const [multipiers, setMultipiers] = useState([300, 300]);
//   const previousScroll = useRef(0);

//   const [sizes, changed] = useWindowSize();

//   const [offsets, remeasure] = useOffsets(scroller);

//   const index = useRef(0);

//   const [scroll] = useScroll(scroller);

//   useEffect(() => {
//     if (changed) {
//       remeasure();
//     }
//   }, [changed, remeasure]);

//   useEffect(() => {
//     if (scroll.direction === 'left' && scroll.left <= offsets.width * multipiers[0]) {
//       setMultipiers(([before, after]) => {
//         return [before - 1, after + 1];
//       });
//       decrementer();
//     }

//     if (scroll.direction === 'right' && scroll.left >= offsets.width * (multipiers[0] + 2)) {
//       setMultipiers(([before, after]) => {
//         return [before + 1, after - 1];
//       });
//       incrementer();
//     }
//   }, [decrementer, incrementer, multipiers, offsets.width, scroll.direction, scroll.left]);

//   const childStyle = useMemo(() => {
//     return {
//       flexShrink: 0,
//       width: `${(count * 100) / count}%`,
//     };
//   }, [count]);

//   useEffect(() => {
//     if (!set.current && offsets.width !== 0) {
//       scroller.current.scrollLeft = offsets.width * multipiers[0];

//       set.current = true;
//     }
//   }, [changed, multipiers, offsets.width]);

//   return useMemo(() => {
//     return (
//       <div ref={scroller} style={SCROLLER_STYLE}>
//         <div style={CONTAINER_CONTENTS}>
//           <Spacer space={offsets.width} multipier={multipiers[0]} />
//           {Children.map(children, (child) => {
//             return (
//               <div key={child.key} style={childStyle}>
//                 {child}
//               </div>
//             );
//           })}

//           <Spacer space={offsets.width} multipier={multipiers[1]} />
//         </div>
//       </div>
//     );
//   }, [childStyle, children, multipiers, offsets.width]);
// };

// export default CalendarScroller;
