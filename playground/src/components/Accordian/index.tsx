import React from 'react';
import cx from '@/components/Accordian/cx';
import Accordion1 from '@/components/Accordian/1_r';

const Accordian = () => {
  return (
    <div className={cx('Accordions')}>
      <h2>아코디언</h2>
      <Accordion1 />
    </div>
  );
};

export default Accordian;
