import { useInView } from 'react-intersection-observer';

const InView = (props) => {
  const { children, ...inViewProps } = props;
  const [ref, inView, entry] = useInView(inViewProps);

  if ('IntersectionObserver' in window) {
    return props.children({ inView, ref, entry });
  }

  return props.children({ inView: true });
};

export default InView;
