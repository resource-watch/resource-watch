export interface WidgetCaptionProps {
  text: string;
}

const WidgetCaption = ({ text }: WidgetCaptionProps): JSX.Element => {
  return (
    <div className="px-3 py-2 border border-t-0 rounded-bl rounded-br shadow-sm border-gray-light shadow-gray-light">
      <span className="text-xs italic">{text}</span>
    </div>
  );
};

export default WidgetCaption;
