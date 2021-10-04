import {
  useCallback,
} from 'react';

export default function UserReportButton() {
  const onClick = useCallback(() => {
    // eslint-disable-next-line no-underscore-dangle
    window._urq.push(['Feedback_Open']);
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      className="c-user-report"
    >
      Feedback
    </button>
  );
}
