import React, { useState, useEffect } from 'react';
import Notice from './notice';

export interface Notice extends ToastProps {
  id: string,
}
const MAX_COUNT = 5;

export let add: (notice: Notice) => void;

function Notification(): JSX.Element {
  const [notices, setNotices] = useState<Notice[]>([]);

  add = function add(notice: Notice): void {
    setNotices((prevNotices) => [...prevNotices, notice]);
  };

  function remove(notice: Notice, timeout = 0): void { // for fade out animation
    const { id } = notice;
    setTimeout(() => {
      setNotices((prevNotices) => (
        prevNotices.filter(({ id: itemID }) => id !== itemID)
      ));
    }, timeout);
  }

  useEffect(() => {
    if (notices.length > MAX_COUNT) {
      const [firstNotice] = notices;
      remove(firstNotice);
    }
  }, [notices]);

  return (
    <>
      {
        notices.map((notice) => (
          <Notice key={notice.id} notice={notice} onClose={remove} />
        ))
      }
    </>
  );
}

export default Notification
